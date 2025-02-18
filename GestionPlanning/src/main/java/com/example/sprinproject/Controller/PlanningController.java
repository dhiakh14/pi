package com.example.sprinproject.Controller;

import com.example.sprinproject.Entity.Planning;
import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.Service.PlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Plan")
@CrossOrigin(origins = "http://localhost:4200")


public class PlanningController {

    @Autowired
    private PlanningService planningService;

    @PutMapping("/updatePlanning/{idPlan}")
    public Planning updatePlanning(@RequestBody Planning planning, @PathVariable Long idPlan) {
        return planningService.updatePlanning(idPlan, planning);
    }
    @GetMapping("/getPlannings")
        public List<Planning> getAllPlannings() {
            return planningService.getPlannings();
        }

        @GetMapping("/getPlanningById/{idPlan}")
        public Planning getPlanningById(@PathVariable Long idPlan) {
            return planningService.getPlanningById(idPlan);
        }

        @PostMapping("/add")
        public Planning addPlanning(@RequestBody Planning planning) {
            return planningService.addPlanning(planning);
        }

    @GetMapping("/{idPlan}/tasks")
    public List<Task> getTasksByPlanningId(@PathVariable Long idPlan) {
        return planningService.getTasksByPlanningId(idPlan);
    }

    @PutMapping("/{idPlan}/assignTasks")
    public Planning assignTasksToPlanning(@PathVariable Long idPlan, @RequestParam List<Long> taskIds) {
        return planningService.assignTasksToPlanning(idPlan, taskIds);
    }


}
