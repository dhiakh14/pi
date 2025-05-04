package com.example.supplier.model;

public class PredictionResponse {
    private String status;       // e.g., "active" or "inactive"
    private double[][] probabilities;  // Probabilities returned by the model

    // Constructor, getters, and setters
    public PredictionResponse(String status, double[][] probabilities) {
        this.status = status;
        this.probabilities = probabilities;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double[][] getProbabilities() {
        return probabilities;
    }

    public void setProbabilities(double[][] probabilities) {
        this.probabilities = probabilities;
    }
}
