package com.chatbot.repository;

import com.chatbot.model.ChatSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    Optional<ChatSession> findByUserEmail(String userEmail);
}
