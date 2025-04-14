package com.esprit.pi.project.repository;

import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    long countByStatus(Status status);

    // Récupérer les coordonnées d'un projet par son ID
    @Query("SELECT p.latitude, p.longitude FROM Project p WHERE p.idProject = :idProject")
    List<Object[]> findCoordinatesByIdProject(@Param("idProject") Long idProject);


    // Compter les projets par statut
    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countProjectsByStatus();

    // Calculer la durée moyenne des projets
    @Query("SELECT AVG(DATEDIFF(p.endDate, p.startDate)) FROM Project p")
    Double averageProjectDuration();
}