package com.example.sprinproject.Controller;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.Service.TaskService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Task")
@CrossOrigin(origins = "http://localhost:4200")


public class TaskController {

    @Autowired
    private TaskService taskService;

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
    public ResponseEntity<Map<String, Double>> predictDuration(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String description = request.get("description");

        // Validate input
        if (name == null || description == null || name.trim().isEmpty() || description.trim().isEmpty()) {
            return new ResponseEntity<>(Map.of("error", -1.0), HttpStatus.BAD_REQUEST);
        }

        try {
            Double predictedDuration = taskService.predictTaskDuration(name, description);

            return new ResponseEntity<>(Map.of("The expected duration is ", predictedDuration), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", -1.0), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }










    }
