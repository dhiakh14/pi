package com.example.sprinproject.Service;

import com.example.sprinproject.Entity.GanttChart;
import com.example.sprinproject.Entity.Task;
import com.example.sprinproject.repository.GanttChartRepository;
import com.example.sprinproject.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class GanttChartService {

    @Autowired
    private GanttChartRepository ganttChartRepo;

    @Autowired
    private TaskRepo taskRepo;

    public GanttChart saveGanttChart(GanttChart ganttChart) {
        List<Task> managedTasks = new ArrayList<>();
        for (Task task : ganttChart.getTasks()) {
            Task managedTask = taskRepo.findById(task.getIdTask()).orElseThrow(() -> new RuntimeException("Task not found with ID: " + task.getIdTask()));
            managedTasks.add(managedTask);
        }
        ganttChart.setTasks(managedTasks);

        return ganttChartRepo.save(ganttChart);
    }

    public List<GanttChart> getCharts(){
        return ganttChartRepo.findAll();
    }

    public GanttChart getGanttById(Long idGantt){
        return ganttChartRepo.findById(idGantt).orElse(null);
    }

    public void deleteChart(Long idGantt){
        ganttChartRepo.deleteById(idGantt);
    }

    public GanttChart updateGanttChart(Long idGantt, GanttChart updatedGanttChart) {
        return ganttChartRepo.findById(idGantt).map(ganttChart -> {
            ganttChart.setTaskName(updatedGanttChart.getTaskName());
            ganttChart.setStartDate(updatedGanttChart.getStartDate());
            ganttChart.setEndDate(updatedGanttChart.getEndDate());
            ganttChart.setProgress(updatedGanttChart.getProgress());
            return ganttChartRepo.save(ganttChart);
        }).orElseThrow(() -> new RuntimeException("Gantt Chart not found with ID: " + idGantt));
    }

    public List<Task> getTasksByGanttChartId(Long ganttChartId) {
        GanttChart ganttChart = ganttChartRepo.findById(ganttChartId)
                .orElseThrow(() -> new RuntimeException("Gantt Chart not found with ID: " + ganttChartId));
        return ganttChart.getTasks();
    }
}