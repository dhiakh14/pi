package tn.esprit.exam.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import tn.esprit.exam.model.PredictRequest;
import tn.esprit.exam.model.PredictResponse;

@Service
public class PredictionService {

    private final RestTemplate restTemplate;

    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictResponse getPredictionFromFlask(PredictRequest predictionRequest) {
        // Flask API URL (ensure this is the correct one)
        String flaskApiUrl = "http://localhost:5000/predict-price"; // Use the correct endpoint for your Flask API

        try {
            // Log the request JSON to ensure it's being sent correctly
            ObjectMapper mapper = new ObjectMapper();
            String jsonRequest = mapper.writeValueAsString(predictionRequest);
            System.out.println("🔍 JSON envoyé à Flask: " + jsonRequest);  // Log the request

            // Set headers for the request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            // Wrap request and headers in HttpEntity
            HttpEntity<String> entity = new HttpEntity<>(jsonRequest, headers);

            // Sending the POST request to Flask and receiving the response
            ResponseEntity<String> flaskResponse = restTemplate.exchange(flaskApiUrl, HttpMethod.POST, entity, String.class);

            // Parsing the Flask response
            String responseBody = flaskResponse.getBody();
            System.out.println("🔍 Réponse de Flask: " + responseBody); // Log the response

            // Now, map the response body to the PredictResponse class
            ObjectMapper objectMapper = new ObjectMapper();
            PredictResponse predictResponse = objectMapper.readValue(responseBody, PredictResponse.class);

            return predictResponse;

        } catch (HttpClientErrorException e) {
            // Handling HTTP errors (e.g., 4xx responses)
            System.out.println("Erreur HTTP lors de l'appel à l'API Flask : " + e.getMessage());
            System.out.println("Détails de la réponse : " + e.getResponseBodyAsString());
            e.printStackTrace();
            return null;

        } catch (HttpServerErrorException e) {
            // Handling server errors (e.g., 5xx responses)
            System.out.println("Erreur du serveur lors de l'appel à l'API Flask : " + e.getMessage());
            e.printStackTrace();
            return null;

        } catch (Exception e) {
            // General exception handling
            System.out.println("Exception lors de l'appel à l'API Flask : " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
