package com.esprit.pi.project.service;

import com.esprit.pi.project.TaskClient.TaskClient;
import com.esprit.pi.project.TaskDTO.TaskDTO;
import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import com.esprit.pi.project.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskClient taskClient;

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
    public String deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project != null) {
            try {
                // Step 1: Delete all tasks associated with the project
                taskClient.deleteTasksByProjectId(projectId);

                projectRepository.deleteById(projectId);
                return "Project and associated tasks deleted successfully";
            } catch (Exception e) {
                    System.err.println("Error deleting project or associated tasks: " + e.getMessage());
                return "Failed to delete project or associated tasks";
            }
        } else {
            return "Project not found";
        }
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




    public long countProjectsByStatus(Status status) {
        return projectRepository.countByStatus(status);
    }

    public Optional<Project> findByName(String name) {
        // Searching for the project by its name
        return projectRepository.findByName(name);
    }
}
