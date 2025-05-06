package com.example.gestionlivrables.services;

import com.example.gestionlivrables.dto.LivrableDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PredictionService {
    private final RestTemplate restTemplate;

    @Autowired
    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String predictLivrableStatus(LivrableDTO livrableDTO) {
        String url = "http://localhost:5000/predictEmira";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LivrableDTO> request = new HttpEntity<>(livrableDTO, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        return response.getBody(); // e.g. "Late", "Approved", etc.
    }

}
