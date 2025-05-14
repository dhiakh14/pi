package com.esprit.pi.project.dto;

public class ProjectDTO {
    private double duration_days;
    private double estimated_budget_kdt;
    private int team_size;
    private int complexity_encoded;

    public ProjectDTO() {}

    public ProjectDTO(double duration_days, double estimated_budget_kdt, int team_size, int complexity_encoded) {
        this.duration_days = duration_days;
        this.estimated_budget_kdt = estimated_budget_kdt;
        this.team_size = team_size;
        this.complexity_encoded = complexity_encoded;
    }

    public double getDuration_days() {
        return duration_days;
    }

    public void setDuration_days(double duration_days) {
        this.duration_days = duration_days;
    }

    public double getEstimated_budget_kdt() {
        return estimated_budget_kdt;
    }

    public void setEstimated_budget_kdt(double estimated_budget_kdt) {
        this.estimated_budget_kdt = estimated_budget_kdt;
    }

    public int getTeam_size() {
        return team_size;
    }

    public void setTeam_size(int team_size) {
        this.team_size = team_size;
    }

    public int getComplexity_encoded() {
        return complexity_encoded;
    }

    public void setComplexity_encoded(int complexity_encoded) {
        this.complexity_encoded = complexity_encoded;
    }

    @Override
    public String toString() {
        return "ProjectDTO{" +
                "duration_days=" + duration_days +
                ", estimated_budget_kdt=" + estimated_budget_kdt +
                ", team_size=" + team_size +
                ", complexity_encoded=" + complexity_encoded +
                '}';
    }
}