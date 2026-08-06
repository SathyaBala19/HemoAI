package com.auth.dto;

// DTO = Data Transfer Object. This is just a plain container we send back
// to the frontend after a successful login - it holds the JWT token plus
// a few basic details about the user so the frontend doesn't need to ask
// for them separately.
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer"; // tells the client how to use the token
    private Long userId;
    private String email;
    private String name;
    private String role;

    public AuthResponse(String token, Long userId, String email, String name, String role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    // Getters only - once this object is built, we don't need to change it.
    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getRole() { return role; }
}
