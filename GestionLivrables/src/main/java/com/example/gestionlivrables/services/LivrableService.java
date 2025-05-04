package com.example.gestionlivrables.services;

import com.example.gestionlivrables.ProjectClient.ProjectClient;
import com.example.gestionlivrables.ProjectClient.ProjectDTO;
import com.example.gestionlivrables.dto.LivrableAlertDTO;
import com.example.gestionlivrables.dto.LivrableDTO;
import com.example.gestionlivrables.dto.StatsDTO;
import com.example.gestionlivrables.entities.Livrable;
import com.example.gestionlivrables.entities.Status;
import com.example.gestionlivrables.repositories.LivrableRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.pdf.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import org.springframework.web.client.RestTemplate;


import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

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

    //Stats Livrables
    public StatsDTO getStats() {
        StatsDTO dto = new StatsDTO();
        dto.setTotal(livrableRepo.count());
        dto.setLate(livrableRepo.countLateLivrables());

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] obj : livrableRepo.countByStatus()) {
            statusMap.put(obj[0].toString(), (Long) obj[1]);
        }
        dto.setByStatus(statusMap);

        Map<String, Long> monthMap = new HashMap<>();
        for (Object[] obj : livrableRepo.countCreatedByMonth()) {
            String month = Month.of((Integer) obj[0]).name();
            monthMap.put(month, (Long) obj[1]);
        }
        dto.setByMonth(monthMap);

        Map<String, Long> projectMap = new HashMap<>();
        for (Object[] obj : livrableRepo.countByProject()) {
            projectMap.put((String) obj[0], (Long) obj[1]);
        }
        dto.setByProject(projectMap);

        List<Livrable> all = livrableRepo.findAll();
        int completed = all.stream().mapToInt(Livrable::getCompleted_count).sum();
        int total = all.stream().mapToInt(Livrable::getTotal_count).sum();
        dto.setCompletionRate(total == 0 ? 0 : (double) completed / total * 100);

        return dto;
    }

    // Advanced Filtering
    public List<Livrable> filterLivrables(Status status, String projectName, Date fromDate, Date toDate) {
        return livrableRepo.filterLivrables(status, projectName, fromDate, toDate);
    }

    // Upcoming Livrable Alert DTO
    public List<LivrableAlertDTO> getUpcomingLivrableAlerts(int alertWindowInDays) {
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.DAY_OF_YEAR, alertWindowInDays);
        Date future = cal.getTime();

        List<Livrable> upcoming = livrableRepo.findUpcomingLivrables(Status.InProgress, now, future);

        return upcoming.stream().map(l -> {
            long daysLeft = ChronoUnit.DAYS.between(
                    l.getDue_date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                    LocalDate.now()
            ) * -1;
            return new LivrableAlertDTO(l.getTitle(), l.getProjectName(), l.getDue_date(), daysLeft);
        }).collect(Collectors.toList());
    }

    //pdf livrables
    public byte[] generatePdfForLivrable(Long id) {
        Livrable livrable = livrableRepo.findById(id).orElseThrow();
        ProjectDTO project = projectClient.getProjectById(livrable.getIdProject());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 50, 50, 50, 70); // Extra space at bottom for footer

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // ✅ Logo
            InputStream logoStream = getClass().getClassLoader().getResourceAsStream("static/images/logo.png");
            if (logoStream != null) {
                Image logo = Image.getInstance(logoStream.readAllBytes());
                logo.scaleToFit(70, 80);
                logo.setAlignment(Image.ALIGN_LEFT);
                document.add(logo);
            }

            // ✅ Title
            Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(255, 87, 34)); // Fancy orange
            Paragraph title = new Paragraph("📄 Livrable Details", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // ✅ Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            table.setWidths(new float[]{1f, 2f});

            Color headerColor = new Color(255, 204, 153); // light orange
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.BLACK);
            Font cellFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.DARK_GRAY);

            addRow(table, "Title", livrable.getTitle(), headerFont, cellFont, headerColor);
            addRow(table, "Format", String.valueOf(livrable.getFormat()), headerFont, cellFont, headerColor);
            addRow(table, "Status", String.valueOf(livrable.getStatus()), headerFont, cellFont, headerColor);
            addRow(table, "Completed / Total", livrable.getCompleted_count() + " / " + livrable.getTotal_count(), headerFont, cellFont, headerColor);
            addRow(table, "Due Date", String.valueOf(livrable.getDue_date()), headerFont, cellFont, headerColor);
            addRow(table, "Created At", String.valueOf(livrable.getCreatedAt()), headerFont, cellFont, headerColor);
            addRow(table, "Description", livrable.getDescription(), headerFont, cellFont, headerColor);

            addRow(table, "Project Name", project.getName(), headerFont, cellFont, headerColor);
            addRow(table, "Project Description", project.getDescription(), headerFont, cellFont, headerColor);
            addRow(table, "Start Date", String.valueOf(project.getStartDate()), headerFont, cellFont, headerColor);
            addRow(table, "End Date", String.valueOf(project.getEndDate()), headerFont, cellFont, headerColor);
            addRow(table, "Project Status", String.valueOf(project.getProjectStatus()), headerFont, cellFont, headerColor);

            document.add(table);

            // ✅ Fancy Footer (bottom-right)
            PdfContentByte canvas = writer.getDirectContent();
            Font footerFont = new Font(Font.HELVETICA, 10, Font.ITALIC, Color.GRAY);
            Phrase footer = new Phrase("Contact us at innov8tors.com", footerFont);
            float x = document.right() - 10;
            float y = document.bottom() - 20;
            ColumnText.showTextAligned(canvas, Element.ALIGN_RIGHT, footer, x, y, 0);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            document.close(); // ✅ important to flush & finalize PDF
        }

        return out.toByteArray();
    }


    private void addRow(PdfPTable table, String key, String value, Font headerFont, Font cellFont, Color headerColor) {
        PdfPCell header = new PdfPCell(new Phrase(key, headerFont));
        header.setBackgroundColor(headerColor);
        header.setPadding(8);
        header.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(header);

        PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "-", cellFont));
        cell.setPadding(8);
        table.addCell(cell);
    }

    public String predictStatus(String description, int completedCount, int totalCount) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = new HashMap<>();
        request.put("description", description);
        request.put("completed_count", completedCount);
        request.put("total_count", totalCount);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "http://localhost:5000/predict", request, Map.class);

        return (String) response.getBody().get("prediction");
    }









}

