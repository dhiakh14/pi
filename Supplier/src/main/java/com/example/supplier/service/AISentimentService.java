package com.example.supplier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AISentimentService {

    @Value("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")
    private String apiKey;

    private static final String API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";

    public String analyzeSentiment(String text) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("inputs", text);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    request,
                    List.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get(0);
                String label = (String) results.get(0).get("label");
                return label;
            }
        } catch (Exception e) {
            System.out.println("Error during sentiment analysis: " + e.getMessage());
        }

        return "neutral"; // fallback
    }

    // Optional: Convert label to a star rating
    public float convertSentimentToRating(String sentimentLabel) {
        switch (sentimentLabel.toLowerCase()) {
            case "positive":
                return 5.0f;
            case "neutral":
                return 3.0f;
            case "negative":
                return 1.0f;
            default:
                return 2.5f;
        }
    }
}
