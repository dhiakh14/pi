package com.example.supplier.controller;

import com.example.supplier.model.Supplier;
import com.example.supplier.model.MaterialResource;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.service.SupplierService;
import com.example.supplier.repository.MaterialResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:4200")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private MaterialResourceRepository materialResourceRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    // Get all suppliers
    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAllSuppliers();
    }

    // Get supplier by ID
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        return supplierService.getSupplierById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new supplier and associate with a material resource
    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        if (supplier.getMaterialResource() == null || supplier.getMaterialResource().getIdMR() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        return materialResourceRepository.findById(supplier.getMaterialResource().getIdMR())
                .map(materialResource -> {
                    supplier.setMaterialResource(materialResource);
                    return ResponseEntity.ok(supplierRepository.save(supplier));
                })
                .orElse(ResponseEntity.badRequest().body(null));
    }

    // Update supplier and associate with a new material resource
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return supplierService.getSupplierById(id)
                .map(existingSupplier -> {
                    if (supplier.getMaterialResource() != null && supplier.getMaterialResource().getIdMR() != null) {
                        Optional<MaterialResource> materialResource = materialResourceRepository.findById(supplier.getMaterialResource().getIdMR());
                        materialResource.ifPresent(supplier::setMaterialResource);
                    }
                    return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete supplier by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (supplierService.getSupplierById(id).isPresent()) {
            supplierService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    /*@GetMapping("/api/material-resources")
    public List<MaterialResource> getMaterialResources() {
        return materialResourceRepository.findAll(); // or any custom query like findByFirstName()
    }*/
    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("/material-resources")
    public ResponseEntity<List<MaterialResource>> getMaterialResources() {
        List<MaterialResource> resources = materialResourceRepository.findAll();
        if (resources.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return HTTP 204 if no data
        }
        return ResponseEntity.ok(resources);
    }

}
