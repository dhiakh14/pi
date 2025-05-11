package com.example.supplier.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PredictionResponse {
    private int prediction; // 1 for active, 0 for inactive
    private String sentiment;
    private int aiRating;
    private int clickCount;
    private long createdAt;
    private Map<String, Double> featureImportance; // Add feature importance if needed
    private String predictionStatus; // Add predictionStatus field
}
