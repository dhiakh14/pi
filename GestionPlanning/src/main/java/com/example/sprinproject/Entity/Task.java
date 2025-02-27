package com.example.sprinproject.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTask;
    private String name;
    private String description ;
    private Date startDate ;
    private Date planned_end_date;
    private Date actual_end_date;
    @Enumerated(EnumType.STRING)
    private Status Status;

    @ManyToOne
    @JoinColumn(name = "gantt_chart_id")
    @JsonIgnore
    private GanttChart ganttChart;

    @Override
    public String toString() {
        return "Task{" +
                "idTask=" + idTask +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", startDate=" + startDate +
                ", planned_end_date=" + planned_end_date +
                ", actual_end_date=" + actual_end_date +
                ", status=" + Status +
                '}';
    }



}
