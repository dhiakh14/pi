package com.example.gestionlivrables.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString

public class Livrable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLivrable;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private Long idProject;


    private String projectName;

    @Enumerated(EnumType.STRING)
    private Format format;

    private String description;

    private int completed_count; //Nombre de livrables complétés
    private int total_count; //Nombre total de livrables

    @Enumerated(EnumType.STRING)
    private Status status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date due_date; //date d'écheance
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;


}
