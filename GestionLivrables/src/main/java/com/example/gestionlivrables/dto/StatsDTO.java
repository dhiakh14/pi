package com.example.gestionlivrables.dto;

import lombok.Data;

import java.util.Map;

@Data
public class StatsDTO {
    private long total;
    private long late;
    private Map<String, Long> byStatus;
    private Map<String, Long> byMonth;
    private Map<String, Long> byProject;
    private double completionRate;

    // GETTERS AND SETTERS
    public long getTotal() {
        return total;
    }
    public void setTotal(long total) {
        this.total = total;
    }
    public long getLate() {
        return late;
    }
    public void setLate(long late) {
        this.late = late;
    }
    public Map<String, Long> getByStatus() {
        return byStatus;
    }
    public void setByStatus(Map<String, Long> byStatus) {
        this.byStatus = byStatus;
    }
    public Map<String, Long> getByMonth() {
        return byMonth;
    }
    public void setByMonth(Map<String, Long> byMonth) {
        this.byMonth = byMonth;
    }
    public Map<String, Long> getByProject() {
        return byProject;
    }
    public void setByProject(Map<String, Long> byProject) {
        this.byProject = byProject;
    }
    public double getCompletionRate() {
        return completionRate;
    }
    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
}
