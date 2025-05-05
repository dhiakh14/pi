package com.esprit.pi.project.dto;

public class ProjectDTO {
    private String name;
    private double duration;

    // Constructeurs
    public ProjectDTO() {}

    public ProjectDTO(String name, double duration) {
        this.name = name;
        this.duration = duration;
    }

    // Getters et setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "ProjectDTO{" +
                "name='" + name + '\'' +
                ", duration=" + duration +
                '}';
    }
}