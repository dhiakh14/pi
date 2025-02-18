package com.example.sprinproject.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class Planning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlan;
    private String name;

    @OneToMany(mappedBy = "planning", cascade = CascadeType.ALL)
    private Set<Task> tasks ;
}
