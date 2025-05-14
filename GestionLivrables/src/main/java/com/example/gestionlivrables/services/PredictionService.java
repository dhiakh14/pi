package com.example.gestionlivrables.services;

import com.example.gestionlivrables.dto.LivrableDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {
    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper;  // Add ObjectMapper for parsing JSON

    @Autowired
    public PredictionService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String predictLivrableStatus(LivrableDTO livrableDTO) {
        // Flask API URL (ensure Flask is running)
        String url = "http://localhost:5000/predictNewEmira";

        // Map LivrableDTO to a simplified JSON format that Flask understands
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("description", livrableDTO.getDescription());
        requestBody.put("createdAt", livrableDTO.getCreatedAt().toString());  // Format to string if necessary
        requestBody.put("due_date", livrableDTO.getDue_date().toString());    // Format to string if necessary
        requestBody.put("title", livrableDTO.getTitle());
        requestBody.put("projectName", livrableDTO.getProjectName());
        requestBody.put("completed_count", livrableDTO.getCompleted_count());
        requestBody.put("total_count", livrableDTO.getTotal_count());

        // Set headers to send JSON data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Prepare HttpEntity with the request body
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // Call Flask API using RestTemplate
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        try {
            // Parse the response body to extract the prediction value
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path("prediction").asText();  // Extract the "prediction" value
        } catch (Exception e) {
            // Handle any parsing exceptions here
            e.printStackTrace();
            return "Error parsing prediction response";
        }
    }
}
