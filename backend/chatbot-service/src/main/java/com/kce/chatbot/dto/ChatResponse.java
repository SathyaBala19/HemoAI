package com.kce.chatbot.dto;

// What we send back to the frontend - just the assistant's reply text.
public class ChatResponse {

    private String reply;

    public ChatResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() { return reply; }
}
