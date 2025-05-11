package tn.esprit.exam.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tn.esprit.exam.model.PredictRequest;
import tn.esprit.exam.model.PredictResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
public class PredictionController {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;  // Add ObjectMapper for JSON parsing

    private final String flaskApiUrl = "http://localhost:5000/predict-price";  // Flask API URL

    @Autowired
    public PredictionController(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/predicted_price")
    public ResponseEntity<PredictResponse> getPrediction(@RequestBody PredictRequest predictionRequest) {
        // Prepare the JSON body for the Flask API
        String jsonBody = "{"
                + "\"first_name\": \"" + predictionRequest.getFirstName() + "\","
                + "\"quantity\": " + predictionRequest.getQuantity() + ","
                + "\"category\": \"" + predictionRequest.getCategory() + "\""
                + "}";

        // Set headers for the request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        try {
            // Send the POST request to Flask API
            ResponseEntity<String> flaskResponse = restTemplate.exchange(flaskApiUrl, HttpMethod.POST, entity, String.class);

            // Parse the response JSON to extract the predicted price
            String responseBody = flaskResponse.getBody();
            JsonNode responseJson = objectMapper.readTree(responseBody);
            double predictedPrice = responseJson.path("predicted_price").asDouble();

            // Return the predicted price in the response
            PredictResponse predictionResponse = new PredictResponse(predictedPrice);
            return ResponseEntity.ok(predictionResponse);

        } catch (Exception e) {
            // Handle errors from the Flask API
            return ResponseEntity.status(500).body(new PredictResponse("Error calling Flask API: " + e.getMessage()));
        }
    }
}
