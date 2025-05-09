package com.example.supplier.controller;

import com.example.supplier.model.PredictionRequest;
import com.example.supplier.model.PredictionResponse;
import com.example.supplier.model.Supplier;
import com.example.supplier.service.SupplierService;
import com.example.supplier.service.SupplierPredictionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.time.ZoneOffset;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/prediction")
public class PredictionController {

    private RestTemplate restTemplate;
    private String pythonApiUrl = "http://localhost:5000/predict"; // Flask API URL
    private final SupplierPredictionService predictionService;
    private final SupplierService supplierService;

    @Autowired
    public PredictionController(RestTemplate restTemplate, SupplierPredictionService predictionService, SupplierService supplierService) {
        this.restTemplate = restTemplate;
        this.predictionService = predictionService;
        this.supplierService = supplierService;

    }

    @PostMapping("/supplier_prediction")
    public PredictionResponse getPrediction(@RequestBody PredictionRequest request) {
        // Log the received request data
        System.out.println("Received data: " + request);

        // Call Flask API to get prediction
        return predictionService.getPredictionFromFlaskApi(request);
    }


    // Method to get prediction details for a specific supplier
    @GetMapping("/supplier-prediction-details/{id}")
    public ResponseEntity<Supplier> getPredictionDetails(@PathVariable Long id) {
        // Fetch supplier details from the database
        Supplier supplier = supplierService.getSupplierById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Fetch prediction data from the predictionService
        PredictionRequest predictionRequest = new PredictionRequest();
        predictionRequest.setSentiment(supplier.getSentiment());
        predictionRequest.setAiRating(supplier.getAiRating().intValue());
        predictionRequest.setClickCount(supplier.getClickCount());
        predictionRequest.setCreatedAt(supplier.getCreatedAt().toEpochDay());  // Converts LocalDate to long

        PredictionResponse predictionResponse = predictionService.getPredictionFromFlaskApi(predictionRequest);

        // Adding prediction status and featureImportance to the supplier object
        supplier.setPredictionStatus(predictionResponse.getPredictionStatus());
        supplier.setFeatureImportance(predictionResponse.getFeatureImportance());  // Set the feature importance here

        return ResponseEntity.ok(supplier);
    }





}
