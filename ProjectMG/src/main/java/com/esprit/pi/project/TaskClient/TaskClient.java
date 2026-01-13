package com.esprit.pi.project.TaskClient;

import com.esprit.pi.project.TaskDTO.TaskDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.scheduling.config.Task;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "TASK-SERVICE", url = "http://localhost:8086/planning")


public interface TaskClient {

    @GetMapping("/Task/getTasksByProject/{projectId}")
    List<TaskDTO> getTasksByProjectId(@PathVariable Long projectId);

    @PostMapping("/Task/addTask")
    TaskDTO addTask(@RequestBody TaskDTO taskDTO);

    @PutMapping("/Task/updateTask/{idTask}")
    TaskDTO updateTask(@PathVariable Long idTask, @RequestBody TaskDTO taskDTO);

    @DeleteMapping("/Task/deleteTask/{id}")
    void deleteTask(@PathVariable Long id);

    @DeleteMapping("/Task/deleteTasksByProject/{projectId}")
    void deleteTasksByProjectId(@PathVariable Long projectId);
}
