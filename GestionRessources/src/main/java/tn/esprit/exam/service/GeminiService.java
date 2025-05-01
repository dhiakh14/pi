package tn.esprit.exam.service;

import tn.esprit.exam.entity.MaterialResources;
import tn.esprit.exam.repository.ImaterialRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    private ImaterialRepo materialRepo;

    public String chatAboutMaterials(String userPrompt) {
        List<MaterialResources> materials = materialRepo.findAll();
        String systemPrompt = buildSystemPrompt(materials);
        String fullPrompt = systemPrompt + "\n\nUser: " + userPrompt;

        return getGeminiResponse(fullPrompt);
    }

    public String chatAboutMaterial(Long materialId, String userPrompt) {
        MaterialResources mat = materialRepo.findById(materialId).orElse(null);
        if (mat == null) return "Material not found";

        String systemPrompt = buildMaterialPrompt(mat);
        String fullPrompt = systemPrompt + "\n\nUser: " + userPrompt;

        return getGeminiResponse(fullPrompt);
    }

    private String getGeminiResponse(String prompt) {
        try {
            String url = BASE_URL + apiKey;

            Map<String, Object> request = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(Map.of("text", prompt)));
            request.put("contents", List.of(content));
            request.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of(
                            "text", "You are an expert in managing material resources. Provide clear insights and suggestions."
                    ))
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map<?, ?> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<?> candidates = (List<?>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> contentMap = (Map<?, ?>) candidate.get("content");
                    List<?> parts = (List<?>) contentMap.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) ((Map<?, ?>) parts.get(0)).get("text");
                    }
                }
            }
            return "Error processing Gemini response";
        } catch (Exception e) {
            return "Error communicating with Gemini: " + e.getMessage();
        }
    }

    private String buildSystemPrompt(List<MaterialResources> materials) {
        StringBuilder sb = new StringBuilder();
        sb.append("System: You are helping manage material resources. Here is the current list:\n");

        if (materials.isEmpty()) {
            sb.append("No materials currently in the system.");
        } else {
            materials.forEach(mat -> sb.append(formatMaterial(mat)).append("\n"));
        }

        sb.append("\nUse this data to provide relevant and actionable answers.");
        return sb.toString();
    }

    private String buildMaterialPrompt(MaterialResources mat) {
        return String.format(
                "System: Analyzing a material resource:\n" +
                        "ID: %d\nName: %s\nQuantity: %d\nPrice: %.2f\nCategory: %s\n" +
                        "Give suggestions related to this resource.",
                mat.getIdMR(),
                mat.getFirstName(),
                mat.getQuantity(),
                mat.getPrice(),
                mat.getCategory()
        );
    }

    private String formatMaterial(MaterialResources mat) {
        return String.format(
                "- %s (ID: %d) | Quantity: %d | Price: %.2f | Category: %s",
                mat.getFirstName(),
                mat.getIdMR(),
                mat.getQuantity(),
                mat.getPrice(),
                mat.getCategory()
        );
    }
}
