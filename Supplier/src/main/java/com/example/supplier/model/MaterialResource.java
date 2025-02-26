package com.example.supplier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "material_resources")
@Getter
@Setter
public class MaterialResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMR;

    private String firstName;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private Category category;

    private Float price;

    @JsonIgnore
    @OneToMany(mappedBy = "materialResource")
    private List<Supplier> suppliers;

    public enum Category {
        CONSTRUCTION_MATERIAL,
        EQUIPMENT_AND_MACHINES,
        TOOLS,
        VEHICLES,
        SECURITY
    }
}
