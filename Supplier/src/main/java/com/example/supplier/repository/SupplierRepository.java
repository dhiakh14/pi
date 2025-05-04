package com.example.supplier.repository;

import com.example.supplier.model.MaterialResource;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;





import java.time.LocalDate;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    //long countByStatus(String status);
    long countByStatus(Status status);



    @Query("SELECT DISTINCT s.materialResource FROM Supplier s")
    List<MaterialResource> findAllMaterialResources();
    List<Supplier> findTop5ByOrderByClickCountDesc();
    //////////
    @Query("SELECT COUNT(s) FROM Supplier s WHERE s.createdAt >= :startOfMonth")
    long countNewSuppliers(LocalDate startOfMonth);



}
