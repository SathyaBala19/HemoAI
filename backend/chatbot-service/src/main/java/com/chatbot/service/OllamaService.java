package com.chatbot.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.chatbot.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

// Talks to a LOCAL Ollama server (see https://ollama.com) over plain
// HTTP - Ollama must already be running on your machine (default port
// 11434) with a model pulled, e.g.:
//   ollama pull llama3.2
//   ollama serve
// This class doesn't call any cloud AI service - everything runs on
// your own computer.
@Service
public class OllamaService {

    @Value("${ollama.base-url}")
    private String baseUrl;

    @Value("${ollama.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    // Sends the whole conversation to Ollama's /api/chat endpoint and
    // returns just the assistant's reply text.
    public String chat(List<ChatMessage> messages) {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", model);
        requestBody.addProperty("stream", false); // simpler than handling a streaming response

        JsonArray messagesJson = new JsonArray();
        for (ChatMessage message : messages) {
            JsonObject messageJson = new JsonObject();
            messageJson.addProperty("role", message.getRole());
            messageJson.addProperty("content", message.getContent());
            messagesJson.add(messageJson);
        }
        requestBody.add("messages", messagesJson);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chat"))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(60)) // local LLM replies can take a while
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        HttpResponse<String> response;
        try {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Could not reach Ollama at " + baseUrl + " - is it running? (ollama serve)", e);
        }

        if (response.statusCode() != 200) {
            throw new IllegalStateException("Ollama returned an error (HTTP " + response.statusCode()
                    + "): " + response.body());
        }

        JsonObject root = JsonParser.parseString(response.body()).getAsJsonObject();
        JsonObject messageNode = root.getAsJsonObject("message");
        if (messageNode == null || !messageNode.has("content")) {
            return "(empty response)";
        }
        return messageNode.get("content").getAsString();
    }
}
