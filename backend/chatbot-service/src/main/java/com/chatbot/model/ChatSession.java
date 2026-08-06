package com.chatbot.model;

import com.chatbot.dto.ChatMessage;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

// One user's ongoing conversation with the chatbot. Keyed by their email
// (from the verified JWT) since that's the stable identity chatbot-service
// has - there's no local user table here.
@Document(collection = "chat_sessions")
public class ChatSession {

    @Id
    private String id;

    private String userEmail;
    private List<ChatMessage> messages = new ArrayList<>();
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
