package com.chatbot.security;

// Who is making this chat request, read from their verified JWT (see
// JwtAuthFilter). ChatController uses the role to tell the model whether
// it's talking to a donor or hospital staff, without trusting anything
// the client could fake in the request body.
public record AuthenticatedUser(String email, String role) {
}
