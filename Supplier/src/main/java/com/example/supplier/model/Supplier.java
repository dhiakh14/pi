package com.example.supplier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.example.supplier.model.Status;


import java.time.LocalDate;

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
    ////
    private LocalDate createdAt;
///

    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;
    @Column(nullable = false)
    private int clickCount = 0;


    // Reference to MaterialResource
    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "material_resource_id")  // Column in Supplier table linking to MaterialResource
    private MaterialResource materialResource;
}

/*enum Status {
    ACTIVE,
    INACTIVE
}*/
