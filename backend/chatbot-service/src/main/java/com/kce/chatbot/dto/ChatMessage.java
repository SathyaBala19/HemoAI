package com.kce.chatbot.dto;

// One message in the conversation. "role" is "user" or "assistant" -
// same shape Ollama's /api/chat endpoint expects, so we can pass the
// frontend's message list straight through without reshaping it.
public class ChatMessage {

    private String role;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
