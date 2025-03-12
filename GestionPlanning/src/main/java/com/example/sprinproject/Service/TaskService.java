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

    public Double predictTaskDuration(String name, String description) {
        String url = "http://127.0.0.1:5000/predict";

        try {
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("name", name);
            requestBody.put("description", description);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = responseEntity.getBody();
                if (responseBody != null && responseBody.containsKey("The expected duration is ")) {
                    return (Double) responseBody.get("The expected duration is ");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to get prediction from Flask service: " + e.getMessage(), e);
        }

        throw new RuntimeException("Failed to get prediction from Flask service: Invalid response");
    }









}
