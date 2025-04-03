package com.example.supplier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AISentimentService {

    private final RestTemplate restTemplate;

    @Value("${huggingface.api.key}")
    private String apiKey;

    private static final String HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";

    public AISentimentService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String analyzeSentiment(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", List.of(text));  // Wrap text inside a list
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    HUGGINGFACE_API_URL, HttpMethod.POST, entity, List.class
            );

            if (response.getBody() != null && !response.getBody().isEmpty()) {
                List<Map<String, Object>> result = (List<Map<String, Object>>) response.getBody().get(0);

                return determineSentiment(result);
            } else {
                return "Unable to determine sentiment.";
            }
        } catch (Exception e) {
            return "Error analyzing sentiment: " + e.getMessage();
        }
    }

    private String determineSentiment(List<Map<String, Object>> result) {
        String label = (String) result.get(0).get("label"); // "LABEL_0", "LABEL_1", or "LABEL_2"

        switch (label) {
            case "LABEL_0":
                return "Negative 😡";
            case "LABEL_1":
                return "Neutral 😐";
            case "LABEL_2":
                return "Positive 😃";
            default:
                return "Unknown sentiment.";
        }
    }
}
