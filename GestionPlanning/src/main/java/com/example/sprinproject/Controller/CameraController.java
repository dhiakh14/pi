package com.example.sprinproject.Controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/camera")
@CrossOrigin(origins = "http://localhost:4200")

public class CameraController {



    private final String PYTHON_API_URL = "http://localhost:5000";

    @PostMapping("/start")
    public String startCamera() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(PYTHON_API_URL + "/start_camera", null, String.class);
    }

    @PostMapping("/stop")
    public String stopCamera() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.postForObject(PYTHON_API_URL + "/stop_camera", null, String.class);
    }

    @GetMapping("/status")
    public String getCameraStatus() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(PYTHON_API_URL + "/camera_status", String.class);
    }

    @GetMapping
    public String getDetection() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(PYTHON_API_URL + "/detect", String.class);
    }

}


