package com.example.gestionlivrables.services;

import com.example.gestionlivrables.ProjectClient.ProjectClient;
import com.example.gestionlivrables.ProjectClient.ProjectDTO;
import com.example.gestionlivrables.dto.LivrableDTO;
import com.example.gestionlivrables.entities.Livrable;
import com.example.gestionlivrables.entities.Status;
import com.example.gestionlivrables.repositories.LivrableRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;

@Service
public class LivrableService {

    @Autowired
    private LivrableRepository livrableRepo ;

    @Autowired
    private ProjectClient projectClient;



    @Transactional
    public Livrable createLivrable(Livrable livrable) {
        // Step 1: Validate required fields
        if (livrable.getTitle() == null || livrable.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title is required.");
        }

        if (livrable.getProjectName() == null || livrable.getProjectName().isEmpty()) {
            throw new IllegalArgumentException("Project name is required.");
        }

        if (livrable.getFormat() == null) {
            throw new IllegalArgumentException("Format is required.");
        }

        if (livrable.getDescription() == null || livrable.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Description is required.");
        }

        if (livrable.getDue_date() == null) {
            throw new IllegalArgumentException("Due date is required.");
        }

        // Step 2: Retrieve project info from the ProjectMg microservice using projectName
        ProjectDTO project;
        try {
            project = projectClient.getProjectByName(livrable.getProjectName());
        } catch (Exception e) {
            throw new IllegalArgumentException("Project with name '" + livrable.getProjectName() + "' not found.");
        }

        // Step 3: Set projectId to livrable (link to project)
        livrable.setIdProject(project.getIdProject()); // adapt if your field is named differently

        // Step 4: Set default status to IN_PROGRESS if not provided
        if (livrable.getStatus() == null) {
            livrable.setStatus(Status.InProgress);
        }

        // Step 5: Set createdAt and updatedAt timestamps
        livrable.setCreatedAt(new Date());
        livrable.setUpdatedAt(null);

        // Step 6: Calculate livrables count for this project name
        int totalCount = calculateTotalCount(livrable.getProjectName());
        livrable.setTotal_count(totalCount);

        int completedCount = calculateCompletedCount(livrable.getProjectName());
        livrable.setCompleted_count(completedCount);

        // Step 7: Save livrable
        return livrableRepo.save(livrable);
    }

    // Dynamic calculation of completed_count
    private int calculateCompletedCount(String projectName) {
        // Count the livrables that have the status 'COMPLETED' for the same project
        return livrableRepo.countByProjectNameAndStatus(projectName, Status.Completed);
    }

    // Dynamic calculation of total_count
    private int calculateTotalCount(String projectName) {
        // Count all livrables for the same project name
        return livrableRepo.countByProjectName(projectName);
    }

    //UPDATE
    @Transactional
    public Livrable updateLivrable(Long livrableId, Livrable updatedLivrable) {
        // Step 1: Retrieve the existing livrable
        Livrable livrable = livrableRepo.findById(livrableId)
                .orElseThrow(() -> new IllegalArgumentException("Livrable not found"));

        // Step 2: Update the fields of the livrable based on the updatedLivrable
        if (updatedLivrable.getTitle() != null && !updatedLivrable.getTitle().isEmpty()) {
            livrable.setTitle(updatedLivrable.getTitle());
        }

        // If projectName is updated, retrieve the projectId from the ProjectMg microservice
        if (updatedLivrable.getProjectName() != null && !updatedLivrable.getProjectName().isEmpty()) {
            try {
                // Fetch project by name from ProjectMg microservice
                ProjectDTO project = projectClient.getProjectByName(updatedLivrable.getProjectName());
                livrable.setIdProject(project.getIdProject());  // Set projectId based on project data from the microservice
            } catch (Exception e) {
                throw new IllegalArgumentException("Project with name '" + updatedLivrable.getProjectName() + "' not found.");
            }
            livrable.setProjectName(updatedLivrable.getProjectName());  // Update projectName if provided
        }

        if (updatedLivrable.getDescription() != null && !updatedLivrable.getDescription().isEmpty()) {
            livrable.setDescription(updatedLivrable.getDescription());
        }
        if (updatedLivrable.getDue_date() != null) {
            livrable.setDue_date(updatedLivrable.getDue_date());
        }
        if (updatedLivrable.getStatus() != null) {
            livrable.setStatus(updatedLivrable.getStatus());
        }

        // Step 3: Update the updatedAt field to the current system date
        livrable.setUpdatedAt(new Date());

        // Step 4: Recalculate completed_count if the status was updated
        if (updatedLivrable.getStatus() != null) {
            livrable.setCompleted_count(calculateCompletedCount(livrable.getProjectName()));
        }

        // Step 5: Save the updated livrable
        return livrableRepo.save(livrable);
    }


    public void deleteLivrable(Long id) {
        // Vérifier si le livrable existe avant de le supprimer
        Livrable livrable = livrableRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Livrable not found"));

        // Récupérer le nom du projet avant suppression
        String projectName = livrable.getProjectName();

        // Supprimer le livrable
        livrableRepo.deleteById(id);

        // Mettre à jour le nombre total de livrables pour ce projet
        int totalCount = livrableRepo.countByProjectName(projectName);

        // Mettre à jour tous les livrables restants avec le nouveau total
        List<Livrable> livrables = livrableRepo.findByProjectName(projectName);
        for (Livrable l : livrables) {
            l.setTotal_count(totalCount);
            livrableRepo.save(l);
        }
    }



    //GET BY ID
    public Livrable getLivrableById(Long id){
        return livrableRepo.findById(id).orElse(null);
    }

    //GET BY TITLE
    public Livrable getLivrableByTitle(String title){
        return livrableRepo.findByTitle(title);
    }

    //GET ALL
    public List<Livrable> getAllLivrables() {
        List<Livrable> livrables = livrableRepo.findAll();
        Date currentDate = new Date();

        for (Livrable l : livrables) {
            if (l.getDue_date() != null && l.getDue_date().before(currentDate) && l.getStatus() != Status.Completed) {
                l.setStatus(Status.Late);
                livrableRepo.save(l); // Mise à jour en base
            }
        }

        return livrables;
    }

    //GET by format
    public List<Livrable> getLivrableByFormat(String format){
        return livrableRepo.findByFormat(format);
    }

    //GET by status
    public List<Livrable> getLivrableByStatus(Status status){
        return livrableRepo.findByStatus(status);
    }

    public List<Livrable> getLivrableByProjectName(String projectName){
        return livrableRepo.findByProjectName(projectName);
    }

    public Map<String, List<Livrable>> getLivrablesGroupedByProject() {
        List<Livrable> livrables = livrableRepo.findAll();
        Map<String, List<Livrable>> groupedByProject = new HashMap<>();

        for (Livrable livrable : livrables) {
            String projectName = livrable.getProjectName();

            // Si le projet existe déjà dans la map
            if (groupedByProject.containsKey(projectName)) {
                groupedByProject.get(projectName).add(livrable);
            } else {
                // Sinon on crée une nouvelle liste
                List<Livrable> newList = new ArrayList<>();
                newList.add(livrable);
                groupedByProject.put(projectName, newList);
            }
        }

        return groupedByProject;
    }

    public LivrableDTO calculateLivrableProgress(Livrable livrable) {
        LivrableDTO dto = new LivrableDTO();
        BeanUtils.copyProperties(livrable, dto);

        // Determine the time left to complete the livrable
        long remainingTime = livrable.getDue_date().getTime() - System.currentTimeMillis();
        long daysRemaining = remainingTime / (1000 * 60 * 60 * 24); // Convert ms to days

        // Check if the livrable is completed or overdue
        boolean isCompleted = livrable.getStatus() == Status.Completed;
        boolean isOverdue = livrable.getDue_date() != null && new Date().after(livrable.getDue_date()) && !isCompleted;

        // Progress calculation: Check for updates to predict if the livrable will complete on time
        double progressPercentage = 0;
        if (isCompleted) {
            progressPercentage = 100;
        } else if (livrable.getUpdatedAt() != null) {
            // If updates are frequent, it might indicate progress
            long updateFrequency = System.currentTimeMillis() - livrable.getUpdatedAt().getTime();
            if (updateFrequency < (1000 * 60 * 60 * 24)) {  // Updated within 24 hours
                progressPercentage = 80; // Likely close to completion
            } else {
                progressPercentage = 50; // Might be stuck or delayed
            }
        }

        dto.setProgressPercentage(progressPercentage);
        dto.setIsCompleted(isCompleted);
        dto.setIsOverdue(isOverdue);
        dto.setDaysRemaining(daysRemaining); // Include days left for better tracking

        return dto;
    }





}

