package com.example.supplier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AISummarizationService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    private static final String HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    private final RestTemplate restTemplate = new RestTemplate();  // ✅ Creates an HTTP client

    public String summarizeText(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", text);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map[]> response = restTemplate.exchange(
                    HUGGINGFACE_API_URL, HttpMethod.POST, entity, Map[].class
            );

            if (response.getBody() != null && response.getBody().length > 0) {
                return (String) response.getBody()[0].get("summary_text");
            } else {
                return "❌ Summarization failed. No response from API.";
            }
        } catch (Exception e) {
            return "❌ Error summarizing text: " + e.getMessage();
        }
    }
}
