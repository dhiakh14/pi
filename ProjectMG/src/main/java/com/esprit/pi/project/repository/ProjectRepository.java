package com.esprit.pi.project.repository;

import com.esprit.pi.project.entity.Project;
import com.esprit.pi.project.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    long countByStatus(Status status);

    Optional<Project> findByName(String name);
}