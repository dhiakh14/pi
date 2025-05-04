package com.example.supplier.controller;

import com.example.supplier.model.PredictionRequest;
import com.example.supplier.model.PredictionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/prediction")
public class PredictionController {

    private RestTemplate restTemplate;
    private String pythonApiUrl = "http://localhost:5000/predict/supplier_prediction";

    @Autowired
    public PredictionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/supplier_prediction")
    public PredictionResponse getPrediction(@RequestBody PredictionRequest request) {
        // Log the received request data
        System.out.println("Received data: " + request);

        // Prepare the request for the Python API
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<PredictionRequest> entity = new HttpEntity<>(request, headers);

        // Send the prediction request to the Python model (assuming it's exposed as a REST API)
        ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                pythonApiUrl, HttpMethod.POST, entity, PredictionResponse.class
        );

        return response.getBody();
    }
}
