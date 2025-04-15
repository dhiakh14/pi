package com.esprit.pi.project.controller;

import com.esprit.pi.project.TaskDTO.TaskDTO;
import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import com.esprit.pi.project.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project")
@CrossOrigin(origins = "http://localhost:4200")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    //CRUD
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        return new ResponseEntity<>(projectService.addProject(project), HttpStatus.CREATED);
    }

    @PutMapping(value = "/{idProject}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> updateProject(@PathVariable Long idProject, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(idProject, project);
        if (updatedProject != null) {
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping
    public ResponseEntity<List<Project>> getAll() {
        return new ResponseEntity<>(projectService.getAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/{idProject}")
    public ResponseEntity<Project> findProjectById(@PathVariable Long idProject) {
        return new ResponseEntity<>(projectService.findProjectById(idProject), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{idProject}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> deleteProject(@PathVariable(value = "idProject") Long idProject){
        return new ResponseEntity<String>(projectService.deleteProject(idProject), HttpStatus.OK);
    }

    //Autres fonctionnalités
    @GetMapping("/stats")
    public ResponseEntity<Long> countProjectsByStatus(@RequestParam Status status) {
        long count = projectService.countProjectsByStatus(status);
        return new ResponseEntity<>(count, HttpStatus.OK);
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
