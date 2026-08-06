package com.chatbot.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.chatbot.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

// Talks to a LOCAL Ollama server (see https://ollama.com) over plain
// HTTP - Ollama must already be running on your machine (default port
// 11434) with a model pulled, e.g.:
//   ollama pull llama3.2
//   ollama serve
// This class doesn't call any cloud AI service - everything runs on
// your own computer.
//
// Uses the classic blocking HttpURLConnection instead of
// java.net.http.HttpClient: HttpClient always opens a
// java.nio.channels.Selector internally, whose loopback wakeup pipe fails
// with "Unable to establish loopback connection" on machines where
// Docker/WSL has altered the Windows loopback interface.
@Service
public class OllamaService {

    @Value("${ollama.base-url}")
    private String baseUrl;

    @Value("${ollama.model}")
    private String model;

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

        String responseBody;
        int statusCode;
        try {
            HttpURLConnection connection = (HttpURLConnection) URI.create(baseUrl + "/api/chat").toURL().openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(60000); // local LLM replies can take a while

            byte[] payload = requestBody.toString().getBytes(StandardCharsets.UTF_8);
            try (var out = connection.getOutputStream()) {
                out.write(payload);
            }

            statusCode = connection.getResponseCode();
            InputStream stream = statusCode >= 200 && statusCode < 300
                    ? connection.getInputStream()
                    : connection.getErrorStream();
            responseBody = readAll(stream);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Could not reach Ollama at " + baseUrl + " - is it running? (ollama serve)", e);
        }

        if (statusCode != 200) {
            throw new IllegalStateException("Ollama returned an error (HTTP " + statusCode + "): " + responseBody);
        }

        JsonObject root = JsonParser.parseString(responseBody).getAsJsonObject();
        JsonObject messageNode = root.getAsJsonObject("message");
        if (messageNode == null || !messageNode.has("content")) {
            return "(empty response)";
        }
        return messageNode.get("content").getAsString();
    }

    private static String readAll(InputStream stream) throws IOException {
        if (stream == null) {
            return "";
        }
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        try (stream) {
            stream.transferTo(buffer);
        }
        return buffer.toString(StandardCharsets.UTF_8);
    }
}
