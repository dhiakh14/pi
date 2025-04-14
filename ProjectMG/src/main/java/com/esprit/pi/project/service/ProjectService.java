package com.esprit.pi.project.service;

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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjectService {
    private final RestTemplate restTemplate = new RestTemplate();

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

    //Autres fonctionnalités

    public long countProjectsByStatus(Status status) {
        return projectRepository.countByStatus(status);
    }


    // Statistiques par statut
    public Map<Status, Long> getProjectsByStatus() {
        List<Object[]> results = projectRepository.countProjectsByStatus();
        Map<Status, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put((Status) result[0], (Long) result[1]);
        }
        return stats;
    }

    // Durée moyenne des projets
    public Double getAverageProjectDuration() {
        return projectRepository.averageProjectDuration();
    }


    //Géolocalisation des projets
    public String getProjectLocation(Long idProject) {
        List<Object[]> coordinates = projectRepository.findCoordinatesByIdProject(idProject);
        if (coordinates.isEmpty()) {
            throw new RuntimeException("Project coordinates not found");
        }
        Double latitude = (Double) coordinates.get(0)[0];
        Double longitude = (Double) coordinates.get(0)[1];
        return "https://www.google.com/maps?q=" + latitude + "," + longitude;
    }

    //Prédiction
    public String predictStatus(Project project) {
        String url = "http://localhost:5000/predict_status";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Project> request = new HttpEntity<>(project, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        return (String) response.getBody().get("predicted_status");
    }

    //Progrès
    public int getProjectProgress(Long idProject) {
        Project project = projectRepository.findById(idProject).orElse(null);
        if (project == null) return -1;

        return switch (project.getStatus()) {
            case ON_GOING -> 50;
            case COMPLETED -> 100;
            case DELAYED -> 25;
        };
    }

    //API externe : Geolocalisation et les jours restants
    public Map<String, Object> getGeoAndRemainingInfo(Long idProject) {
        Project project = findProjectById(idProject);
        if (project == null) return null;

        Map<String, Object> result = new HashMap<>();

        // Jours restants
        long daysRemaining = ChronoUnit.DAYS.between(
                LocalDate.now(),
                project.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
        );
        result.put("daysRemaining", daysRemaining);

        // API externe : nominatim
        String city = project.getCity(); // ou autre moyen d’obtenir la ville
        String url = "https://nominatim.openstreetmap.org/search?city=" + city + "&format=json";

        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Parser le JSON manuellement
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode root = objectMapper.readTree(response.getBody());

                if (root.isArray() && root.size() > 0) {
                    JsonNode first = root.get(0);
                    result.put("latitude", first.get("lat").asText());
                    result.put("longitude", first.get("lon").asText());
                    result.put("display_name", first.get("display_name").asText());
                } else {
                    result.put("location", "Non trouvée");
                }
            } else {
                result.put("error", "Erreur API externe");
            }

        } catch (Exception e) {
            result.put("exception", e.getMessage());
        }

        return result;
    }

}
