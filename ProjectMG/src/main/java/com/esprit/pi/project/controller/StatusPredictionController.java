package com.esprit.pi.project.controller;

import com.esprit.pi.project.dto.ProjectDTO;
import com.esprit.pi.project.dto.PredictionResponseDTO;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/predict")
@CrossOrigin(origins = "http://localhost:4200")
public class StatusPredictionController {

    private final String pythonApiUrl = "http://localhost:5000/predict/project_status";

    @PostMapping("/project_status")
    public PredictionResponseDTO predictStatus(@RequestBody ProjectDTO projectDTO) {
        try {
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("duration", projectDTO.getDuration());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    pythonApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> responseBody = responseEntity.getBody();
            String predictedStatus = (String) responseBody.get("predicted_status");

            return new PredictionResponseDTO(predictedStatus);

        } catch (Exception e) {
            return new PredictionResponseDTO(null);
        }
    }
}