package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.TaskRepo;
import com.opencsv.CSVWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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









}
