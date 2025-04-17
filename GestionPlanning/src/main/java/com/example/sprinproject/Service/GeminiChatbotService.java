package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class GeminiChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    private TaskRepo taskRepo;

    public String chatAboutTasks(String userPrompt) {
        List<Task> tasks = taskRepo.findAll();
        String systemPrompt = buildSystemPrompt(tasks);
        String fullPrompt = systemPrompt + "\n\nUser: " + userPrompt;

        return getGeminiResponse(fullPrompt);
    }

    public String chatAboutTask(Long taskId, String userPrompt) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) return "Task not found";

        String systemPrompt = buildTaskPrompt(task);
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
                            "text", "You are an expert task management assistant. Provide concise, actionable responses."
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

    private String buildSystemPrompt(List<Task> tasks) {
        StringBuilder sb = new StringBuilder();
        sb.append("System: You're assisting with a task management system. Current tasks:\n");

        if (tasks.isEmpty()) {
            sb.append("No tasks currently exist.");
        } else {
            tasks.forEach(task -> sb.append(formatTask(task)).append("\n"));
        }

        sb.append("\nProvide responses based on these tasks.");
        return sb.toString();
    }

    private String buildTaskPrompt(Task task) {
        return String.format(
                "System: You're analyzing a specific task:\n" +
                        "Task ID: %d\nName: %s\nDescription: %s\n" +
                        "Start: %s\nPlanned End: %s\nStatus: %s\n" +
                        "Provide specific recommendations for this task.",
                task.getIdTask(),
                task.getName(),
                task.getDescription(),
                formatDate(task.getStartDate()),
                formatDate(task.getPlanned_end_date()),
                task.getStatus()
        );
    }

    private String formatTask(Task task) {
        return String.format(
                "- %s (ID: %d): %s | Start: %s | End: %s | Status: %s",
                task.getName(),
                task.getIdTask(),
                task.getDescription(),
                formatDate(task.getStartDate()),
                formatDate(task.getPlanned_end_date()),
                task.getStatus()
        );
    }

    private String formatDate(Date date) {
        return date != null ? dateFormat.format(date) : "Not set";
    }
}