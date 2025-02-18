package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.Planning;
import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.PlanningRepo;
import com.example.sprinproject.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service

public class PlanningService {

    @Autowired
    PlanningRepo planningRepo;

    @Autowired
    private TaskRepo taskRepo;

    public List<Task> getTasksByPlanningId(Long planningId) {
        return taskRepo.findTasksByPlanningId(planningId);
    }

    public Planning addPlanning(Planning planning){
        return planningRepo.save(planning);
    }

    public List<Planning> getPlannings(){
        return planningRepo.findAll();
    }

    public Planning getPlanningById(Long idPlan){
        return planningRepo.findById(idPlan).orElse(null);
    }

    public Planning updatePlanning(Long idPlan, Planning updatedPlanning) {
        return planningRepo.findById(idPlan).map(planning -> {
            planning.setName(updatedPlanning.getName());
            return planningRepo.save(planning);
        }).orElseThrow(() -> new RuntimeException("Planning not found with ID: " + idPlan));
    }

    public Planning assignTasksToPlanning(Long planningId, List<Long> taskIds) {
        // Step 1: Get the planning by its ID
        Planning planning = planningRepo.findById(planningId)
                .orElseThrow(() -> new RuntimeException("Planning not found with ID: " + planningId));

        // Step 2: Get the tasks by their IDs
        List<Task> tasks = taskRepo.findAllById(taskIds);

        // Step 3: Assign the planning to each task
        for (Task task : tasks) {
            task.setPlanning(planning); // Set the selected planning for each task
        }

        // Step 4: Save all updated tasks
        taskRepo.saveAll(tasks);

        return planning;
    }
}
