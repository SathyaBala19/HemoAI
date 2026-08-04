package com.kce.chatbot.dto;

import java.util.List;

// What the frontend sends: the whole conversation so far (previous
// messages plus the new one). The frontend keeps history, not this
// service - there's no database here, so nothing is remembered between
// requests unless the client sends it again.
public class ChatRequest {

    private List<ChatMessage> messages;

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }
}
