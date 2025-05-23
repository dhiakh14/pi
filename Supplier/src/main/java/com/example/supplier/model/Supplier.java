package com.example.supplier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.example.supplier.model.Status;
import jakarta.persistence.Column;

import java.time.LocalDate;
import java.util.Map;  // Add this import for Map

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSupplier;

    @Column(nullable = false)
    private String name;

    private String address;
    private String phoneNumber;
    private String email;

    private LocalDate createdAt;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;

    @Column(nullable = false)
    private int clickCount = 0;

    @Column(name = "ai_rating")
    private Float aiRating;

    @Column(name = "sentiment")
    private String sentiment;

    @Transient
    private String predictionStatus;

    @Transient  // Mark this as a transient field so it doesn’t get persisted in the database
    private Map<String, Double> featureImportance;  // Add this field for feature importance

    // Setter for featureImportance
    public void setFeatureImportance(Map<String, Double> featureImportance) {
        this.featureImportance = featureImportance;
    }

    // Reference to MaterialResource
    @ManyToOne
    @JoinColumn(name = "material_resource_id")  // Column in Supplier table linking to MaterialResource
    private MaterialResource materialResource;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }
}
