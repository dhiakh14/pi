package com.esprit.pi.project.service;

import com.esprit.pi.project.dto.ProjectDTO;
import com.esprit.pi.project.dto.PredictionResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class StatusPredictionService {

    private final RestTemplate restTemplate;
    private final String flaskApiUrl = "http://localhost:5000/predict/project_status";

    @Autowired
    public StatusPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponseDTO predictStatus(ProjectDTO dto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ProjectDTO> request = new HttpEntity<>(dto, headers);

            ResponseEntity<PredictionResponseDTO> response = restTemplate.exchange(
                    flaskApiUrl,
                    HttpMethod.POST,
                    request,
                    PredictionResponseDTO.class
            );

            return response.getBody();

        } catch (Exception e) {
            System.err.println("Error calling prediction API: " + e.getMessage());
            return new PredictionResponseDTO("Error processing prediction");
        }
    }
}