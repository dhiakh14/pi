package tn.esprit.exam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class HumanResources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long  idHR;
    private String Name;
    private String lastName;
    @Email(message = "Email is not well formatted")
    private String email;
    private Long phoneNumber;
    private boolean availability;
    @Enumerated(EnumType.STRING)
    private Job_Role Job_Role;

}

