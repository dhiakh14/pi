package com.esprit.pi.project.service;

import com.esprit.pi.project.TaskClient.TaskClient;
import com.esprit.pi.project.TaskDTO.TaskDTO;
import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import com.esprit.pi.project.repository.ProjectRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ProjectService {


    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private TaskClient taskClient;

    @Autowired
    private ProjectRepository projectRepository;

    //CRUD
    public Project addProject(Project project) {
        return projectRepository.save(project);
    }
    public Project updateProject(Long idProject, Project project) {
        if (projectRepository.findById(idProject).isPresent()) {
            Project existingProject = projectRepository.findById(idProject).get();
            existingProject.setName(project.getName());
            existingProject.setDescription(project.getDescription());
            existingProject.setStartDate(project.getStartDate());
            existingProject.setEndDate(project.getEndDate());
            existingProject.setStatus(project.getStatus());
            return projectRepository.save(existingProject);
        } else
            return null;
    }
    public List<Project> getAll(){
        return projectRepository.findAll();
    }
    public Project findProjectById(Long idProject){
        return projectRepository.findById(idProject).orElse(null);
    }
    public void deleteProject(Long idProject) {
        projectRepository.deleteById(idProject);
    }
    public Optional<Project> findByName(String name) {
        return projectRepository.findByName(name);
    }

    //Autres fonctionnalités

    public long countProjectsByStatus(Status status) {
        return projectRepository.countByStatus(status);
    }

    public Map<Status, Long> getProjectsByStatus() {
        List<Object[]> results = projectRepository.countProjectsByStatus();
        Map<Status, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put((Status) result[0], (Long) result[1]);
        }
        return stats;
    }

    public Double getAverageProjectDuration() {
        return projectRepository.averageProjectDuration();
    }

    public String getProjectLocation(Long idProject) {
        List<Object[]> coordinates = projectRepository.findCoordinatesByIdProject(idProject);
        if (coordinates.isEmpty()) {
            throw new RuntimeException("Project coordinates not found");
        }
        Double latitude = (Double) coordinates.get(0)[0];
        Double longitude = (Double) coordinates.get(0)[1];
        return "https://www.google.com/maps?q=" + latitude + "," + longitude;
    }

    public String predictStatus(Project project) {
        String url = "http://localhost:5000/predict_status";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Project> request = new HttpEntity<>(project, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        return (String) response.getBody().get("predicted_status");
    }

    public int getProjectProgress(Long idProject) {
        Project project = projectRepository.findById(idProject).orElse(null);
        if (project == null) return -1;

        return switch (project.getStatus()) {
            case ON_GOING -> 50;
            case COMPLETED -> 100;
            case DELAYED -> 25;
        };
    }

    public Map<String, Object> getRemainingDays(Long idProject) {
        Project project = findProjectById(idProject);
        if (project == null) return null;

        Map<String, Object> result = new HashMap<>();

        long daysRemaining = ChronoUnit.DAYS.between(
                LocalDate.now(),
                project.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
        );

        result.put("daysRemaining", daysRemaining);
        return result;
    }

    public Project getProjectWithTasks(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            List<TaskDTO> tasks = taskClient.getTasksByProjectId(projectId); // Fetch tasks from Task microservice
            project.setTasks(tasks); // Set tasks in the Project entity
        }
        return project;
    }

    public Project addTasksToProject(Long projectId, List<TaskDTO> tasks) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            try {
                for (TaskDTO task : tasks) {
                    task.setProjectId(projectId);
                    taskClient.addTask(task);
                }
                List<TaskDTO> updatedTasks = taskClient.getTasksByProjectId(projectId);
                project.setTasks(updatedTasks);
            } catch (Exception e) {
                System.err.println("Error adding tasks via Task microservice: " + e.getMessage());
                project.setTasks(List.of());
            }
        }
        return project;
    }


}
