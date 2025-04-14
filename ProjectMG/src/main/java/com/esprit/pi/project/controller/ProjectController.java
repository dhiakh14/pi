package com.esprit.pi.project.controller;

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

    // Projet par son statut
    @GetMapping("/getProjectsByStatus/{status}")
    public long countProjectsByStatus(@RequestParam Status status) {
        return projectService.countProjectsByStatus(status);
    }

    // Statistiques par statut
    @GetMapping("/statisticsByStatus")
    public Map<Status, Long> getStatisticsByStatus() {
        return projectService.getProjectsByStatus();
    }

    // Durée moyenne des projets
    @GetMapping("/averageDuration")
    public Double getAverageDuration() {
        return projectService.getAverageProjectDuration();
    }

    //PDF
    public void generatePdf(Project project, String filePath) throws FileNotFoundException, DocumentException {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();
        document.add(new Paragraph("Project Name: " + project.getName()));
        document.add(new Paragraph("Description: " + project.getDescription()));
        document.close();
    }

    //Géolocalisation des projets
    @GetMapping("/location/{idProject}")
    public String getProjectLocation(@PathVariable Long idProject) {
        return projectService.getProjectLocation(idProject);
    }

    //Prédiction
    @PostMapping("/predict-status")
    public ResponseEntity<String> predictProjectStatus(@RequestBody Project project) {
        String prediction = projectService.predictStatus(project);
        return ResponseEntity.ok(prediction);
    }

    // Progrès
    @GetMapping("/progress/{idProject}")
    public ResponseEntity<?> getProjectProgress(@PathVariable Long idProject) {
        int progress = projectService.getProjectProgress(idProject);
        if (progress == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Projet non trouvé");
        }
        return ResponseEntity.ok(Map.of("projectId", idProject, "progress", progress + "%"));
    }

    @GetMapping("/geoAndRemaining/{idProject}")
    public ResponseEntity<Map<String, Object>> getGeoAndRemaining(@PathVariable Long idProject) {
        Map<String, Object> data = projectService.getGeoAndRemainingInfo(idProject);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }
}
