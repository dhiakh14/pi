package com.esprit.pi.project.controller;

import com.esprit.pi.project.dto.PredictionResponseDTO;
import com.esprit.pi.project.dto.ProjectDTO;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/predict")
@CrossOrigin(origins = "http://localhost:4200")
public class RiskPredictionController {

    private final String flaskApiUrl = "http://localhost:5000/predict/risk_level";

    @PostMapping("/risk_level")
    public PredictionResponseDTO predictRiskLevel(@RequestBody ProjectDTO dto) {
        try {
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("duration_days", dto.getDuration_days());
            requestMap.put("estimated_budget_kdt", dto.getEstimated_budget_kdt());
            requestMap.put("team_size", dto.getTeam_size());
            requestMap.put("complexity_encoded", dto.getComplexity_encoded());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    "http://localhost:5000/predict/risk_level",
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> responseBody = responseEntity.getBody();
            String predictedRiskLevel = (String) responseBody.get("predicted_risk_level");

            return new PredictionResponseDTO(predictedRiskLevel);

        } catch (Exception e) {
            return new PredictionResponseDTO("Erreur dans la prédiction");
        }
    }
}