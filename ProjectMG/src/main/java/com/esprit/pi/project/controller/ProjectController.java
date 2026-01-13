package com.esprit.pi.project.controller;

import com.esprit.pi.project.TaskDTO.TaskDTO;
import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import com.esprit.pi.project.service.ProjectService;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins = "http://localhost:4200")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    //CRUD
    @PostMapping("/addProject")
    public Project addProject(@RequestBody Project project) {
        return projectService.addProject(project);
    }

    @PutMapping("/updateProject/{idProject}")
    public Project updateProject(@PathVariable Long idProject, @RequestBody Project project) {
        return projectService.updateProject(idProject,project);
    }
    @GetMapping("/getAllProjects")
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAll();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/getProjectById/{idProject}")
    public Project findProjectById(@PathVariable Long idProject) {
        return projectService.findProjectById(idProject);
    }

    @DeleteMapping("/deleteProject/{idProject}")
    public void deleteProject(@PathVariable(value = "idProject") Long idProject){
        projectService.deleteProject(idProject);
    }

    //Autres fonctionnalités

    @GetMapping("/getProjectsByStatus/{status}")
    public long countProjectsByStatus(@RequestParam Status status) {
        return projectService.countProjectsByStatus(status);
    }

    @GetMapping("/statisticsByStatus")
    public Map<Status, Long> getStatisticsByStatus() {
        return projectService.getProjectsByStatus();
    }

    @GetMapping("/averageDuration")
    public Double getAverageDuration() {
        return projectService.getAverageProjectDuration();
    }

    @GetMapping("/location/{idProject}")
    public String getProjectLocation(@PathVariable Long idProject) {
        return projectService.getProjectLocation(idProject);
    }

    @PostMapping("/predictStatus")
    public ResponseEntity<String> predictProjectStatus(@RequestBody Project project) {
        String prediction = projectService.predictStatus(project);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/progress/{idProject}")
    public ResponseEntity<?> getProjectProgress(@PathVariable Long idProject) {
        int progress = projectService.getProjectProgress(idProject);
        if (progress == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Projet non trouvé");
        }
        return ResponseEntity.ok(Map.of("projectId", idProject, "progress", progress + "%"));
    }

    @GetMapping("/remainingDays/{idProject}")
    public ResponseEntity<Map<String, Object>> getRemainingDays(@PathVariable Long idProject) {
        Map<String, Object> data = projectService.getRemainingDays(idProject);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/{projectId}/with-tasks")
    public ResponseEntity<Project> getProjectWithTasks(@PathVariable Long projectId) {
        Project project = projectService.getProjectWithTasks(projectId);
        if (project != null) {
            return new ResponseEntity<>(project, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{projectId}/add-tasks")
    public ResponseEntity<Project> addTasksToProject(
            @PathVariable Long projectId,
            @RequestBody List<TaskDTO> tasks) {
        Project project = projectService.addTasksToProject(projectId, tasks);
        if (project != null) {
            return new ResponseEntity<>(project, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/name/{name}")
    public Project getProjectByName(@PathVariable String name) {
        return projectService.findByName(name)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }
}
