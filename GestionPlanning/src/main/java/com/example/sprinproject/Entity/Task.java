package com.example.sprinproject.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

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
    @JoinColumn(name = "planning_id")
    @JsonIgnore
    private Planning planning;

}
