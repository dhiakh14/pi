package com.example.sprinproject.Controller;

import com.example.sprinproject.Entity.GanttChart;
import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.Service.GanttChartService;
import com.example.sprinproject.repository.GanttChartRepository;
import com.example.sprinproject.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/gantt-chart")
@CrossOrigin(origins = "http://localhost:4200")

public class GanttChartController {

    @Autowired
    private GanttChartService ganttChartService;
    @Autowired
    private GanttChartRepository ganttChartRepo;
    @Autowired
    private TaskRepo taskRepo;

    @PostMapping("/save")
    public GanttChart saveGanttChart(@RequestBody GanttChart ganttChart) {
        System.out.println("Received GanttChart: " + ganttChart);
        System.out.println("Tasks in GanttChart: " + ganttChart.getTasks());

        List<Task> existingTasks = new ArrayList<>();

        if (ganttChart.getTasks() != null) {
            for (Task task : ganttChart.getTasks()) {
                if (task.getIdTask() != null) { // Check if the task exists
                    Optional<Task> existingTask = taskRepo.findById(task.getIdTask());
                    if (existingTask.isPresent()) {
                        existingTask.get().setGanttChart(ganttChart);
                        existingTasks.add(existingTask.get());
                    }
                }
            }
        }

        ganttChart.setTasks(existingTasks); // Only add existing tasks
        GanttChart savedGanttChart = ganttChartRepo.save(ganttChart);

        System.out.println("Saved GanttChart: " + savedGanttChart);
        return savedGanttChart;
    }




    @GetMapping("/all")
    public List<GanttChart> getAllGanttCharts() {
        List<GanttChart> ganttCharts = ganttChartRepo.findAllWithTasks();
        System.out.println("Fetched Gantt Charts: " + ganttCharts);
        for (GanttChart chart : ganttCharts) {
            System.out.println("Tasks for Gantt Chart " + chart.getId() + ": " + chart.getTasks());
        }
        return ganttCharts;
    }
    @GetMapping("/getGanttChartById/{id}")
    public GanttChart getGanttChartById(@PathVariable Long id) {
        return ganttChartService.getGanttById(id);
    }

    @DeleteMapping("/deleteGanttChart/{id}")
    public void deleteGanttChart(@PathVariable Long id) {
        ganttChartService.deleteChart(id);
    }

    @PutMapping("/update/{id}")
    public GanttChart updateGanttChart(@PathVariable Long id, @RequestBody GanttChart updatedGanttChart) {
        return ganttChartService.updateGanttChart(id, updatedGanttChart);
    }

    @GetMapping("/{ganttChartId}/tasks")
    public List<Task> getTasksByGanttChartId(@PathVariable Long ganttChartId) {
        return ganttChartService.getTasksByGanttChartId(ganttChartId);
    }
}