package com.example.supplier.repository;

import com.example.supplier.model.MaterialResource;
import com.example.supplier.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    @Query("SELECT DISTINCT s.materialResource FROM Supplier s")
    List<MaterialResource> findAllMaterialResources();
}
