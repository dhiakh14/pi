package com.example.gestionlivrables.repositories;

import com.example.gestionlivrables.entities.Livrable;
import com.example.gestionlivrables.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Repository
@CrossOrigin(origins = "http://localhost:4200")
public interface LivrableRepository extends JpaRepository<Livrable,Long> {
    Livrable findByTitle(String title);

    int countByProjectName(String projectName);

    int countByProjectNameAndStatus(String projectName, Status status);

    List<Livrable> findByFormat(String format);

    List<Livrable> findByStatus(Status status);

    List<Livrable> findByProjectName(String projectName);

    int countByStatus(Status status);
}
