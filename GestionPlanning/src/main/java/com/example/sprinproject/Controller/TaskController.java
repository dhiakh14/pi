package com.example.sprinproject.Controller;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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







    }
