package com.example.sprinproject.Controller;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.Service.GeminiChatbotService;
import com.example.sprinproject.Service.TaskService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Task")
@CrossOrigin(origins = "http://localhost:4200")


public class TaskController {

    @Autowired
    private TaskService taskService;
    @Autowired
    private GeminiChatbotService chatbotService;

    @PostMapping("/addTask")
    public Task addTask(@RequestBody Task task){
        return taskService.addTask(task);
    }

    @PutMapping("/updateTask/{idTask}")
    public Task updateTask(@RequestBody Task task, @PathVariable Long idTask) {
        return taskService.updateTask(idTask, task);
    }

    @GetMapping("/getAllTasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("getTaskById/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @DeleteMapping("/deleteTask/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/export")
    public String exportTasksToCsv() {
        try {
            return taskService.exportTasksToCsv();
        } catch (IOException e) {
            return "Failed to export CSV file: " + e.getMessage();
        }
    }
    @PostMapping("/addTasks")
    public List<Task> addTasks(@RequestBody List<Task> tasks) {
        return taskService.addTasks(tasks);
    }
    @GetMapping("/getTasksByProject/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProjectId(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProjectId(projectId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    @DeleteMapping("/deleteTasksByProject/{projectId}")
    public ResponseEntity<String> deleteTasksByProjectId(@PathVariable Long projectId) {
        taskService.deleteTasksByProjectId(projectId);
        return new ResponseEntity<>("Tasks deleted successfully", HttpStatus.OK);
    }

    @PostMapping("/predictDuration")
    public ResponseEntity<Map<String, Object>> predictDuration(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        Integer effectif = (Integer) request.get("effectif");
        String niveauComplexity = (String) request.get("niveau_complexity");

        if (name == null || description == null || name.trim().isEmpty() || description.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Name and description are required"));
        }

        if (effectif == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Effectif (team size) is required"));
        }

        if (niveauComplexity == null || !Arrays.asList("low", "medium", "hard").contains(niveauComplexity.toLowerCase())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Niveau_complexity must be low, medium, or hard"));
        }

        try {
            Double predictedDuration = taskService.predictTaskDuration(
                    name,
                    description,
                    effectif,
                    niveauComplexity
            );

            return ResponseEntity.ok()
                    .body(Map.of("predicted_duration_days", predictedDuration));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/taskchatAboutTaskss")
    public ResponseEntity<String> chatAboutTasks(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt cannot be empty");
        }
        String response = chatbotService.chatAboutTasks(prompt);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/chatAboutTask/{taskId}")
    public ResponseEntity<String> chatAboutTask(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Prompt cannot be empty");
        }
        String response = chatbotService.chatAboutTask(taskId, prompt);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/tasks/{taskId}/recommendations")
    public ResponseEntity<String> getTaskRecommendations(@PathVariable Long taskId) {
        String response = chatbotService.chatAboutTask(taskId,
                "Provide professional recommendations for improving this task");
        return ResponseEntity.ok(response);
    }


    @GetMapping("/analysis/trends")
    public ResponseEntity<String> getStatusTrendAnalysis() {
        String response = chatbotService.chatAboutTasks(
                "Analyze the status trends across all tasks and " +
                        "provide insights about project progress and potential bottlenecks");
        return ResponseEntity.ok(response);
    }










    }
