package com.chatbot.controller;

import com.chatbot.dto.ChatMessage;
import com.chatbot.dto.ChatRequest;
import com.chatbot.dto.ChatResponse;
import com.chatbot.model.ChatSession;
import com.chatbot.repository.ChatSessionRepository;
import com.chatbot.service.OllamaService;
import com.chatbot.security.AuthenticatedUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatController {

    private final OllamaService ollamaService;
    private final ChatSessionRepository chatSessionRepository;

    public ChatController(OllamaService ollamaService, ChatSessionRepository chatSessionRepository) {
        this.ollamaService = ollamaService;
        this.chatSessionRepository = chatSessionRepository;
    }

    // GET /api/chatbot/history - past messages for the logged-in user, so
    // the frontend can restore the conversation after a reload.
    @GetMapping("/history")
    public List<ChatMessage> history(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return chatSessionRepository.findByUserEmail(currentUser.email())
                .map(ChatSession::getMessages)
                .orElseGet(ArrayList::new);
    }

    // POST /api/chatbot/message - send the conversation so far, get the
    // assistant's next reply back. The system prompt is built here from
    // the caller's REAL role (from their verified JWT), not anything the
    // client could fake in the request body. The exchange is appended to
    // the user's stored session in MongoDB.
    @PostMapping("/message")
    public ChatResponse chat(@RequestBody ChatRequest request, @AuthenticationPrincipal AuthenticatedUser currentUser) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system", buildSystemPrompt(currentUser.role())));
        if (request.getMessages() != null) {
            messages.addAll(request.getMessages());
        }

        String reply = ollamaService.chat(messages);

        saveExchange(currentUser.email(), request.getMessages(), reply);

        return new ChatResponse(reply);
    }

    private void saveExchange(String userEmail, List<ChatMessage> requestMessages, String reply) {
        ChatSession session = chatSessionRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    ChatSession newSession = new ChatSession();
                    newSession.setUserEmail(userEmail);
                    return newSession;
                });

        // The client re-sends the whole conversation each time, so store
        // that (minus our injected system prompt) plus the new reply.
        List<ChatMessage> messages = requestMessages != null ? new ArrayList<>(requestMessages) : new ArrayList<>();
        messages.add(new ChatMessage("assistant", reply));

        session.setMessages(messages);
        session.setUpdatedAt(Instant.now());
        chatSessionRepository.save(session);
    }

    private String buildSystemPrompt(String role) {
        String audience = switch (role) {
            case "HOSPITAL_ADMIN" -> "a hospital admin managing blood inventory and staff";
            case "BLOOD_BANK_OFFICER" -> "a blood bank officer handling stock and donor coordination";
            case "DHO" -> "a District Health Officer overseeing regional blood supply";
            case "DONOR" -> "a blood donor";
            default -> "a HemoAI user";
        };
        return "You are the HemoAI assistant, a blood bank management platform. "
                + "You are talking to " + audience + ". "
                + "Keep answers short, practical, and specific to blood banking, donations, "
                + "and blood inventory topics. If asked something unrelated, politely redirect "
                + "back to what HemoAI can help with.";
    }
}
