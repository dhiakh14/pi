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
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<PredictionRequest> entity = new HttpEntity<>(predictionRequest, headers);

        // Sending the POST request to Flask API and expecting a PredictionResponse
        ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                "http://localhost:5000/predict/supp", HttpMethod.POST, entity, PredictionResponse.class);

        // Log the Flask API response to verify the data
        System.out.println("Flask API Response: " + response.getBody());

        // Populate predictionStatus here based on the returned data
        PredictionResponse predictionResponse = response.getBody();
        predictionResponse.setPredictionStatus(predictionResponse.getPrediction() == 1 ? "active" : "inactive");

        return predictionResponse;
    }




}
