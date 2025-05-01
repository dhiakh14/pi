package tn.esprit.exam.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MaterialResources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMR;
    private String firstName;
    private int Quantity;
    private float price;
    @Enumerated(EnumType.STRING)
    private Category category;

}
