package com.chatbot.controller;

import com.chatbot.dto.ChatMessage;
import com.chatbot.dto.ChatRequest;
import com.chatbot.dto.ChatResponse;
import com.chatbot.service.InventoryContextService;
import com.chatbot.service.OllamaService;
import com.chatbot.security.AuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/chatbot")
public class ChatController {

    private static final Set<String> STAFF_ROLES = Set.of("HOSPITAL_ADMIN", "BLOOD_BANK_OFFICER", "DHO");
    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final OllamaService ollamaService;
    private final InventoryContextService inventoryContextService;

    public ChatController(OllamaService ollamaService, InventoryContextService inventoryContextService) {
        this.ollamaService = ollamaService;
        this.inventoryContextService = inventoryContextService;
    }

    // POST /api/chatbot/message - send the conversation so far, get the
    // assistant's next reply back. The system prompt is built here from
    // the caller's REAL role (from their verified JWT), not anything the
    // client could fake in the request body. Stateless - the client is
    // responsible for holding and re-sending the conversation each time.
    @PostMapping("/message")
    public ChatResponse chat(@RequestBody ChatRequest request, @AuthenticationPrincipal AuthenticatedUser currentUser,
                              HttpServletRequest httpRequest) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system", buildSystemPrompt(currentUser.role(), httpRequest)));
        if (request.getMessages() != null) {
            messages.addAll(request.getMessages());
        }

        String reply = ollamaService.chat(messages);

        return new ChatResponse(reply);
    }

    private String buildSystemPrompt(String role, HttpServletRequest httpRequest) {
        String audience = switch (role) {
            case "HOSPITAL_ADMIN" -> "a hospital admin managing blood inventory and staff";
            case "BLOOD_BANK_OFFICER" -> "a blood bank officer handling stock and donor coordination";
            case "DHO" -> "a District Health Officer overseeing regional blood supply";
            case "DONOR" -> "a blood donor";
            default -> "a HemoAI user";
        };
        String prompt = "You are the HemoAI assistant, a blood bank management platform. "
                + "You are talking to " + audience + ". "
                + "Keep answers short, practical, and specific to blood banking, donations, "
                + "and blood inventory topics. If asked something unrelated, politely redirect "
                + "back to what HemoAI can help with. "
                + "Only state specific numbers (unit counts, thresholds) if they're given to you "
                + "below as live data - never invent or guess numbers.";

        // Staff roles can see inventory - hand the model the real current
        // stock levels so it answers from actual data instead of
        // hallucinating plausible-sounding numbers. Donors can't read
        // inventory-service (see its SecurityConfig), so skip this for them.
        if (STAFF_ROLES.contains(role)) {
            String token = extractBearerToken(httpRequest);
            if (token != null) {
                String inventorySummary = inventoryContextService.fetchSummary(token);
                if (inventorySummary != null) {
                    prompt += "\n\n" + inventorySummary;
                }
            }
        }
        return prompt;
    }

    private static String extractBearerToken(HttpServletRequest httpRequest) {
        String header = httpRequest.getHeader(AUTH_HEADER);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            return null;
        }
        return header.substring(BEARER_PREFIX.length());
    }
}
