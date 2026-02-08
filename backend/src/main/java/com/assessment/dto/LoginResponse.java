package com.assessment.dto;

public class LoginResponse {
    private String message;
    private String username;
    private String role;
    private boolean success;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message, String username, String role) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.role = role;
    }

    public static LoginResponse success(String username, String role) {
        return new LoginResponse(true, "Login successful", username, role);
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(false, message, null, null);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
