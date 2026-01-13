package com.esprit.pi.project.service;

import com.esprit.pi.project.dto.ProjectDTO;
import com.esprit.pi.project.dto.PredictionResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

@Service
public class RiskPredictionService {

    private final RestTemplate restTemplate;
    private final String flaskApiUrl = "http://localhost:5000/predict/risk_level";

    @Autowired
    public RiskPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponseDTO predictRiskLevel(ProjectDTO dto) {
        try {
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("duration_days", dto.getDuration_days());
            requestMap.put("estimated_budget_kdt", dto.getEstimated_budget_kdt());
            requestMap.put("team_size", dto.getTeam_size());
            requestMap.put("complexity_encoded", dto.getComplexity_encoded());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    flaskApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            String prediction = (String) response.getBody().get("predicted_risk_level");
            return new PredictionResponseDTO(prediction);

        } catch (Exception e) {
            System.err.println("Erreur appel API Flask : " + e.getMessage());
            return new PredictionResponseDTO("Erreur de prédiction");
        }
    }
}