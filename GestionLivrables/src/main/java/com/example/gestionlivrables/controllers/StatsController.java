package com.example.gestionlivrables.controllers;

import com.example.gestionlivrables.dto.StatsDTO;
import com.example.gestionlivrables.services.LivrableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:4200")
public class StatsController {
    private final LivrableService service;

    public StatsController(LivrableService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}
