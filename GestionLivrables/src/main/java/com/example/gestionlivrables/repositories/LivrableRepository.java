package com.example.gestionlivrables.repositories;

import com.example.gestionlivrables.entities.Livrable;
import com.example.gestionlivrables.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;
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

    //Queries de comptage pour les  stats livrables
    @Query("SELECT COUNT(l) FROM Livrable l WHERE l.due_date < CURRENT_TIMESTAMP AND l.status = 'Late' ")
    long countLateLivrables();

    @Query("SELECT l.status, COUNT(l) FROM Livrable l GROUP BY l.status")
    List<Object[]> countByStatus();

    @Query("SELECT FUNCTION('MONTH', l.createdAt), COUNT(l) FROM Livrable l GROUP BY FUNCTION('MONTH', l.createdAt)")
    List<Object[]> countCreatedByMonth();

    @Query("SELECT l.projectName, COUNT(l) FROM Livrable l GROUP BY l.projectName")
    List<Object[]> countByProject();

    // Custom query for advanced filtering
    @Query("SELECT l FROM Livrable l WHERE " +
            "(l.status = :status OR :status IS NULL) AND " +
            "(l.projectName = :projectName OR :projectName IS NULL) AND " +
            "(l.due_date BETWEEN :fromDate AND :toDate OR (:fromDate IS NULL AND :toDate IS NULL))")
    List<Livrable> filterLivrables(@Param("status") Status status,
                                   @Param("projectName") String projectName,
                                   @Param("fromDate") Date fromDate,
                                   @Param("toDate") Date toDate);

    // Custom query to find upcoming livrables
    @Query("SELECT l FROM Livrable l WHERE l.status = :status AND l.due_date BETWEEN :now AND :future")
    List<Livrable> findUpcomingLivrables(
            @Param("status") Status status,
            @Param("now") Date now,
            @Param("future") Date future
    );

}
