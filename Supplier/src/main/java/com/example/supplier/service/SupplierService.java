package com.example.supplier.service;

import com.example.supplier.dto.SupplierSummaryDTO;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.Status;


import com.example.supplier.model.MaterialResource;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.repository.MaterialResourceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final MaterialResourceRepository materialResourceRepository;


    public SupplierService(SupplierRepository supplierRepository,
                           MaterialResourceRepository materialResourceRepository,
                           AISummarizationService aiSummarizationService) {
        this.supplierRepository = supplierRepository;
        this.materialResourceRepository = materialResourceRepository;
    }


    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }

    public Supplier createSupplier(Supplier supplier) {
        if (supplier.getMaterialResource() == null || supplier.getMaterialResource().getIdMR() == null) {
            throw new IllegalArgumentException("Material Resource ID is required.");
        }
        return materialResourceRepository.findById(supplier.getMaterialResource().getIdMR())
                .map(materialResource -> {
                    supplier.setMaterialResource(materialResource);
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new IllegalArgumentException("Material Resource not found"));
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(supplierDetails.getName());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setPhoneNumber(supplierDetails.getPhoneNumber());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setStatus(supplierDetails.getStatus());
            supplier.setNotes(supplierDetails.getNotes());
            if (supplierDetails.getMaterialResource() != null && supplierDetails.getMaterialResource().getIdMR() != null) {
                materialResourceRepository.findById(supplierDetails.getMaterialResource().getIdMR())
                        .ifPresent(supplier::setMaterialResource);
            }
            return supplierRepository.save(supplier);
        }).orElseThrow(() -> new IllegalArgumentException("Supplier not found"));
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public List<MaterialResource> getAllMaterialResources() {
        return materialResourceRepository.findAll();
    }
    public void incrementClickCount(Long id) {
        supplierRepository.findById(id).ifPresent(supplier -> {
            supplier.setClickCount(supplier.getClickCount() + 1);
            supplierRepository.save(supplier);
        });
    }

    /*public SupplierSummaryDTO getSummary() {
        SupplierSummaryDTO summary = new SupplierSummaryDTO();
        long total = supplierRepository.count();
        //long active = supplierRepository.countByStatus(Status.ACTIVE);

        //long inactive = supplierRepository.countByStatus("inactive");
        long inactive = supplierRepository.countByStatus(Status.INACTIVE);



        long newSuppliers = supplierRepository.countNewSuppliers(LocalDate.now().withDayOfMonth(1));

        summary.setTotalSuppliers(total); /////////TOTAL SUPPLIERS
        summary.setActiveSuppliers(active); /////////ACTIVE SUPPLIERS
        summary.setInactiveSuppliers(inactive); /////////INACTIVE SUPPLIERS

        summary.setNewSuppliersThisMonth(newSuppliers); ////////NEW SUPPLIERS

        return summary;
    }*/

    public SupplierSummaryDTO getSummary() {
        SupplierSummaryDTO summary = new SupplierSummaryDTO();
        long total = supplierRepository.count();
        long active = supplierRepository.countByStatus(Status.ACTIVE);
        long inactive = supplierRepository.countByStatus(Status.INACTIVE);
        long newSuppliers = supplierRepository.countNewSuppliers(LocalDate.now().withDayOfMonth(1));

        summary.setTotalSuppliers(total);
        summary.setActiveSuppliers(active);
        summary.setInactiveSuppliers(inactive);
        summary.setNewSuppliersThisMonth(newSuppliers);

        return summary;
    }



}