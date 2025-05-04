package com.example.supplier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.example.supplier.model.PredictionRequest;
import com.example.supplier.model.PredictionResponse;

@Service
public class SupplierPredictionService {

    @Value("${flask.api.url}")
    private String flaskApiUrl;

    private final RestTemplate restTemplate;

    public SupplierPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponse getPredictionFromFlaskApi(PredictionRequest predictionRequest) {
        // Directly use the createdAt timestamp as it is already a Long
        Long timestamp = predictionRequest.getCreatedAt();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<PredictionRequest> entity = new HttpEntity<>(predictionRequest, headers);

        // Sending the POST request to the Flask API
        ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                flaskApiUrl + "/predict/supplier_prediction", HttpMethod.POST, entity, PredictionResponse.class);

        return response.getBody();  // Return the prediction response
    }
}
