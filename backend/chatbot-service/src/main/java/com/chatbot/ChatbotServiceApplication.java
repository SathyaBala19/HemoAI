package com.chatbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Starting point of the Chatbot Service. Forwards chat messages to a
// local Ollama server and sends the reply back. Boots an embedded
// server on port 8085 (see application.properties).
@SpringBootApplication
public class ChatbotServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatbotServiceApplication.class, args);
    }
}
