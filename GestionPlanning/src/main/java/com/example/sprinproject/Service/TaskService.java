package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.TaskRepo;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service

public class TaskService {

    private final RestTemplate restTemplate = new RestTemplate();


    @Autowired
    private TaskRepo taskRepo;



    public Task addTask(Task task){
        return taskRepo.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepo.findById(id).orElse(null);
    }



    public void deleteTask(Long id) {
        taskRepo.deleteById(id);
    }

    public Task updateTask(Long idTask, Task updatedTask) {
        return taskRepo.findById(idTask).map(task -> {
            task.setName(updatedTask.getName());
            task.setDescription(updatedTask.getDescription());
            task.setStartDate(updatedTask.getStartDate());
            task.setPlanned_end_date(updatedTask.getPlanned_end_date());
            task.setActual_end_date(updatedTask.getActual_end_date());
            task.setStatus(updatedTask.getStatus());
            if (updatedTask.getProjectId() != null) {
                task.setProjectId(updatedTask.getProjectId());
            }


            return taskRepo.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found with ID: " + idTask));
    }

    public String exportTasksToCsv() throws IOException {
        List<Task> tasks = taskRepo.findAll();
        String filePath = "tasks.csv";

        try (CSVWriter writer = new CSVWriter(new FileWriter(filePath))) {
            String[] header = {"Name", "Description", "Start Date", "Planned End Date", "Status"};
            writer.writeNext(header);

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            for (Task task : tasks) {
                String[] data = {
                        task.getName(),
                        task.getDescription(),
                        task.getStartDate() != null ? dateFormat.format(task.getStartDate()) : "",
                        task.getPlanned_end_date() != null ? dateFormat.format(task.getPlanned_end_date()) : "",
                        task.getStatus() != null ? task.getStatus().toString() : ""
                };
                writer.writeNext(data);
            }
        }

        return "CSV file exported successfully: " + filePath;
    }
    public List<Task> addTasks(List<Task> tasks) {
        return taskRepo.saveAll(tasks);
    }

    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepo.findByProjectId(projectId);
    }

    public void deleteTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepo.findByProjectId(projectId);
        taskRepo.deleteAll(tasks);}

    public Double predictTaskDuration(String name, String description, int effectif, String niveauComplexity) {
        String url = "http://localhost:5000/predict";

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("name", name);
            requestBody.put("description", description);
            requestBody.put("effectif", effectif);
            requestBody.put("niveau_complexity", niveauComplexity.toLowerCase());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = responseEntity.getBody();
                if (responseBody != null && responseBody.containsKey("predicted_duration_days")) {
                    Object duration = responseBody.get("predicted_duration_days");
                    if (duration instanceof Integer) {
                        return ((Integer) duration).doubleValue();
                    } else if (duration instanceof Double) {
                        return (Double) duration;
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get prediction from Flask service: " + e.getMessage(), e);
        }

        throw new RuntimeException("Failed to get prediction from Flask service: Invalid response");
    }









}
