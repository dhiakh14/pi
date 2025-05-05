package com.esprit.pi.project.dto;

import lombok.Getter;

@Getter
public class ProjectDTO {
    private String name;
    private double duration;

    public ProjectDTO(String name, double duration) {
        this.name = name;
        this.duration = duration;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }
}
