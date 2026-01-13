package com.esprit.pi.project.dto;

public class PredictionResponseDTO {
    private String prediction;

    public PredictionResponseDTO() {}

    public PredictionResponseDTO(String prediction) {
        this.prediction = prediction;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    @Override
    public String toString() {
        return "PredictionResponseDTO{" +
                "prediction='" + prediction + '\'' +
                '}';
    }
}