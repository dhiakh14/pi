package com.example.supplier.model;

public class PredictionRequest {

    private Long createdAt;  // Keep it as Long for timestamp
    private int aiRating;
    private int clickCount;

    // Getters and Setters
    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public int getAiRating() {
        return aiRating;
    }

    public void setAiRating(int aiRating) {
        this.aiRating = aiRating;
    }

    public int getClickCount() {
        return clickCount;
    }

    public void setClickCount(int clickCount) {
        this.clickCount = clickCount;
    }
}
