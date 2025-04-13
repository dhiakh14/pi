package com.example.supplier.service;

import com.example.supplier.dto.SupplierSummaryDTO;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.Status;
import com.example.supplier.model.MaterialResource;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.repository.MaterialResourceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final MaterialResourceRepository materialResourceRepository;
    private final AISentimentService aiSentimentService;

    @Autowired
    public SupplierService(
            SupplierRepository supplierRepository,
            MaterialResourceRepository materialResourceRepository,
            AISentimentService aiSentimentService
    ) {
        this.supplierRepository = supplierRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.aiSentimentService = aiSentimentService;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> getSupplierById(Long id) {
        return supplierRepository.findById(id);
    }


    public Supplier createSupplier(Supplier supplier) {
        // 1. Validate material resource
        if (supplier.getMaterialResource() == null || supplier.getMaterialResource().getIdMR() == null) {
            throw new IllegalArgumentException("Material Resource ID is required.");
        }

        MaterialResource materialResource = materialResourceRepository.findById(supplier.getMaterialResource().getIdMR())
                .orElseThrow(() -> new EntityNotFoundException("Material Resource not found"));

        // 2. Set basic fields
        supplier.setMaterialResource(materialResource);
        supplier.setCreatedAt(LocalDate.now());
        supplier.setClickCount(0);

        // 3. Only analyze if notes exist
        if (supplier.getNotes() != null && !supplier.getNotes().trim().isEmpty()) {
            System.out.println("Analyzing notes: " + supplier.getNotes());

            String sentiment = aiSentimentService.analyzeSentiment(supplier.getNotes());
            System.out.println("Analysis result: " + sentiment);

            supplier.setSentiment(sentiment);

            // Convert sentiment to rating
            float rating;
            switch(sentiment.toUpperCase()) {
                case "POSITIVE": rating = 5.0f; break;
                case "NEUTRAL": rating = 3.0f; break;
                case "NEGATIVE": rating = 1.0f; break;
                default: rating = 0.0f;
            }
            supplier.setAiRating(rating);
        } else {
            System.out.println("No notes provided for analysis");
            supplier.setSentiment(null);
            supplier.setAiRating(null);
        }

        // 4. Save and return
        Supplier savedSupplier = supplierRepository.save(supplier);
        System.out.println("Saved supplier ID: " + savedSupplier.getIdSupplier());
        /////
        System.out.println("=== BEFORE SAVING ===");
        System.out.println("Notes: " + supplier.getNotes());
        System.out.println("Sentiment: " + supplier.getSentiment());
        System.out.println("AI Rating: " + supplier.getAiRating());
        System.out.println("Material Resource: " + supplier.getMaterialResource());

        Supplier saved = supplierRepository.save(supplier);

        System.out.println("=== AFTER SAVING ===");
        System.out.println("Saved ID: " + saved.getIdSupplier());
        System.out.println("Saved Sentiment: " + saved.getSentiment());
        System.out.println("Saved Rating: " + saved.getAiRating());

        return savedSupplier;
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(supplierDetails.getName());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setPhoneNumber(supplierDetails.getPhoneNumber());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setStatus(supplierDetails.getStatus());
            supplier.setNotes(supplierDetails.getNotes());

            // Reanalyze sentiment on update
            /*String sentiment = aiSentimentService.analyzeSentiment(supplierDetails.getNotes());
            supplier.setSentiment(sentiment);*/

            if (supplier.getNotes() != null) {
                String sentiment = aiSentimentService.analyzeSentiment(supplier.getNotes()); // your logic
                supplier.setSentiment(sentiment);

                float rating = switch (sentiment.toLowerCase()) {
                    case "positive" -> 5.0f;
                    case "neutral" -> 3.0f;
                    case "negative" -> 1.0f;
                    default -> 0.0f;
                };
                supplier.setAiRating(rating);
            }

            if (supplierDetails.getMaterialResource() != null &&
                    supplierDetails.getMaterialResource().getIdMR() != null) {
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
