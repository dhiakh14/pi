package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

}
