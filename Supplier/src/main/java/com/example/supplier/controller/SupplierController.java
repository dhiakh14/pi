package com.example.supplier.controller;

import com.example.supplier.dto.SummarizeRequest;
import com.example.supplier.dto.SupplierSummaryDTO;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.MaterialResource;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.service.AISentimentService;
import com.example.supplier.service.AISummarizationService;
import com.example.supplier.service.SupplierPredictionService;
import com.example.supplier.service.SupplierService;
import com.example.supplier.repository.MaterialResourceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:4200")
public class SupplierController {

    private final SupplierService supplierService;
    private final SupplierRepository supplierRepository;
    private final MaterialResourceRepository materialResourceRepository;
    private final AISentimentService sentimentService;
    private final AISummarizationService summarizationService;
    private final SupplierPredictionService predictionService;


    @Value("${huggingface.api.key}")
    private String API_KEY;

    @Autowired
    public SupplierController(
            SupplierService supplierService,
            SupplierRepository supplierRepository,
            MaterialResourceRepository materialResourceRepository,
            AISentimentService sentimentService,
            AISummarizationService summarizationService,
            SupplierPredictionService predictionService
    ) {
        this.supplierService = supplierService;
        this.supplierRepository = supplierRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.sentimentService = sentimentService;
        this.summarizationService = summarizationService;
        this.predictionService = predictionService;
    }

    // ✅ Get all suppliers
    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAllSuppliers();
    }

    @GetMapping("/prediction-dashboard")
    public List<Supplier> getSupplierPredictions() {
        List<Supplier> suppliers = supplierService.getAllSuppliers();

        // Fetch prediction for each supplier and set the prediction status
        for (Supplier supplier : suppliers) {
            String predictionStatus = supplierService.getPredictionForSupplier(supplier);
            supplier.setPredictionStatus(predictionStatus);  // Set the prediction status on the supplier object
        }

        return suppliers;
    }

    // ✅ Get supplier by ID and increment click count
    //@GetMapping("/{id}")
    /*public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        Optional<Supplier> optionalSupplier = supplierRepository.findById(id);

        if (optionalSupplier.isPresent()) {
            Supplier supplier = optionalSupplier.get();
            supplier.setClickCount(supplier.getClickCount() + 1); // 🔥 Increment click count
            supplierRepository.save(supplier); // ✅ Save updated click count
            return ResponseEntity.ok(supplier);
        }

        return ResponseEntity.notFound().build();
    }*/
    ///
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // ✅ Create supplier
    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        try {
            // Debug log to verify we're using the correct method
            System.out.println("Creating supplier with notes: " + supplier.getNotes());

            Supplier createdSupplier = supplierService.createSupplier(supplier);

            // Debug log to verify the returned values
            System.out.println("Created supplier with sentiment: " + createdSupplier.getSentiment()
                    + " and rating: " + createdSupplier.getAiRating());

            return ResponseEntity.ok(createdSupplier);
        } catch (Exception e) {
            System.out.println("Error creating supplier: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ Update supplier and associate with a new material resource
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

    // ✅ Delete supplier by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (supplierService.getSupplierById(id).isPresent()) {
            supplierService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Get all material resources
    @GetMapping("/material-resources")
    public ResponseEntity<List<MaterialResource>> getMaterialResources() {
        List<MaterialResource> resources = materialResourceRepository.findAll();
        if (resources.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resources);
    }

    // ✅ Increment supplier click count
    @PutMapping("/{id}/increment-click")
    public ResponseEntity<Void> incrementClick(@PathVariable Long id) {
        supplierService.incrementClickCount(id);
        return ResponseEntity.ok().build();
    }

    // ✅ Get top 5 suppliers by clicks
    @GetMapping("/top-suppliers")
    public List<Supplier> getTopSuppliers() {
        return supplierRepository.findTop5ByOrderByClickCountDesc();
    }



    // ✅ Sentiment Analysis Feature
    @PostMapping("/analyze-sentiment")
    public ResponseEntity<Map<String, String>> analyzeSentiment(@RequestBody Map<String, String> requestBody) {
        String text = requestBody.get("text"); // ✅ Make sure this key matches frontend request

        if (text == null || text.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Text cannot be empty"));
        }

        String sentiment = sentimentService.analyzeSentiment(text);
        return ResponseEntity.ok(Collections.singletonMap("sentiment", sentiment));
    }
    /////
    @GetMapping("/summary")
    public SupplierSummaryDTO getSupplierSummary() {
        return supplierService.getSummary();
    }

    @GetMapping("/status-breakdown")
    public Map<String, Long> getSupplierStatusBreakdown() {
        return supplierService.getSupplierStatusBreakdown();
    }
    @GetMapping("/category-breakdown")
    public ResponseEntity<Map<String, Long>> getSupplierCategoryBreakdown() {
        Map<String, Long> categoryBreakdown = supplierService.getSupplierCategoryBreakdown();
        return ResponseEntity.ok(categoryBreakdown);
    }

}
