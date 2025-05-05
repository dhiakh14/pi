package com.example.gestionlivrables.dto;

import com.example.gestionlivrables.entities.Format;
import com.example.gestionlivrables.entities.Status;
import lombok.Data;

import java.util.Date;

@Data
public class LivrableDTO {
    private Long idLivrable;
    private String title;
    private String projectName;
    private Format format;
    private String description;
    private int completed_count;
    private int total_count;
    private Status status;
    private Date due_date;
    private Date createdAt;
    private Date updatedAt;

    // Extra computed stats
    private double progressPercentage;
    private boolean isOverdue;
    private boolean isCompleted;
    private long daysRemaining;



    // GETTER
    public boolean isCompleted() {
        return isCompleted;
    }

    // SETTER
    public void setIsCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    // GETTER
    public boolean isOverdue() {
        return isOverdue;
    }

    // SETTER
    public void setIsOverdue(boolean isOverdue) {
        this.isOverdue = isOverdue;
    }

    // GETTER
    public long getDaysRemaining() {
        return daysRemaining;
    }
    // SETTER
    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }


}
