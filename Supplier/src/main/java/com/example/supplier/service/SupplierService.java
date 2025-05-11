package com.example.supplier.service;

import com.example.supplier.dto.SupplierSummaryDTO;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.MaterialResource;

import com.example.supplier.model.Status;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.repository.MaterialResourceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import  com.example.supplier.model.PredictionRequest;
import  com.example.supplier.model.PredictionResponse;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final MaterialResourceRepository materialResourceRepository;
    private final AISentimentService aiSentimentService;
    private final SupplierPredictionService predictionService;

    @Autowired
    public SupplierService(
            SupplierRepository supplierRepository,
            MaterialResourceRepository materialResourceRepository,
            AISentimentService aiSentimentService,
            SupplierPredictionService predictionService
    ) {
        this.supplierRepository = supplierRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.aiSentimentService = aiSentimentService;
        this.predictionService = predictionService;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Modify this method to return a list of suppliers with prediction status
    public List<Supplier> getAllSuppliersWithPrediction() {
        List<Supplier> suppliers = supplierRepository.findAll();

        for (Supplier supplier : suppliers) {
            // Get prediction status for each supplier
            String predictionStatus = getPredictionForSupplier(supplier);
            supplier.setPredictionStatus(predictionStatus);  // Set prediction status directly in Supplier object
        }

        return suppliers;
    }

    // Modify the prediction logic: Returning prediction status directly
    public String getPredictionForSupplier(Supplier supplier) {
        PredictionRequest request = new PredictionRequest();
        request.setSentiment(supplier.getSentiment());
        request.setAiRating(supplier.getAiRating().intValue());
        request.setClickCount(supplier.getClickCount());

        // Convert LocalDate to epoch seconds using a ZoneOffset (UTC or system default)
        request.setCreatedAt(supplier.getCreatedAt().atStartOfDay(ZoneOffset.UTC).toEpochSecond());

        // Call Flask API to get prediction
        PredictionResponse prediction = predictionService.getPredictionFromFlaskApi(request);
        return prediction.getPrediction() == 1 ? "active" : "inactive";  // Return prediction status
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

        // 3. Analyze notes if available
        if (supplier.getNotes() != null && !supplier.getNotes().trim().isEmpty()) {
            String sentiment = aiSentimentService.analyzeSentiment(supplier.getNotes());
            supplier.setSentiment(sentiment);

            // Convert sentiment to rating
            float rating;
            switch (sentiment.toUpperCase()) {
                case "POSITIVE": rating = 5.0f; break;
                case "NEUTRAL": rating = 3.0f; break;
                case "NEGATIVE": rating = 1.0f; break;
                default: rating = 0.0f;
            }
            supplier.setAiRating(rating);
        } else {
            supplier.setSentiment(null);
            supplier.setAiRating(null);
        }

        // 4. Save and return the supplier
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(supplierDetails.getName());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setPhoneNumber(supplierDetails.getPhoneNumber());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setStatus(supplierDetails.getStatus());
            supplier.setNotes(supplierDetails.getNotes());

            // Reanalyze sentiment if notes are updated
            if (supplierDetails.getNotes() != null) {
                String sentiment = aiSentimentService.analyzeSentiment(supplierDetails.getNotes());
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

    public Map<String, Long> getSupplierStatusBreakdown() {
        long activeCount = supplierRepository.countByStatus(Status.ACTIVE);
        long inactiveCount = supplierRepository.countByStatus(Status.INACTIVE);

        // Create and return a map with active and inactive counts
        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("activeCount", activeCount);
        statusBreakdown.put("inactiveCount", inactiveCount);

        return statusBreakdown;
    }

    public Map<String, Long> getSupplierCategoryBreakdown() {
        List<Supplier> suppliers = supplierRepository.findAll(); // Get all suppliers

        // Group suppliers by category and count occurrences
        Map<String, Long> categoryBreakdown = suppliers.stream()
                .collect(Collectors.groupingBy(s -> s.getMaterialResource().getCategory().toString(), Collectors.counting()));

        return categoryBreakdown;
    }

    public Supplier getSupplierWithPredictionStatus(Long id) {
        // Fetch the supplier from the database
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Manually set the predictionStatus field based on certain conditions
        if (supplier.getPredictionStatus() == null) {
            // Logic to set predictionStatus, for example:
            supplier.setPredictionStatus("inactive"); // Set this based on your business logic
        }

        return supplier;
    }

}
