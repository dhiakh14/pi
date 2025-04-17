package com.example.gestionlivrables.dto;

import lombok.Data;

import java.util.Date;

@Data
public class LivrableAlertDTO {
    private String title;
    private String projectName;
    private Date dueDate;
    private long daysLeft;

    public LivrableAlertDTO(String title, String projectName, Date dueDate, long daysLeft) {
        this.title = title;
        this.projectName = projectName;
        this.dueDate = dueDate;
        this.daysLeft = daysLeft;
    }
}
