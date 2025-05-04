package com.example.supplier.repository;

import com.example.supplier.model.MaterialResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface MaterialResourceRepository extends JpaRepository<MaterialResource, Long> {
    Optional<MaterialResource> findById(Long idMR);

    List<MaterialResource> findByFirstName(String firstName);

    List<MaterialResource> findAll();
}
