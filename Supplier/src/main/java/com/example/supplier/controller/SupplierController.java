package com.example.supplier.controller;

import com.example.supplier.dto.SummarizeRequest;
import com.example.supplier.model.Supplier;
import com.example.supplier.model.MaterialResource;
import com.example.supplier.repository.SupplierRepository;
import com.example.supplier.service.AISentimentService;
import com.example.supplier.service.AISummarizationService;
import com.example.supplier.service.SupplierService;
import com.example.supplier.repository.MaterialResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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

    @Value("${huggingface.api.key}")
    private String API_KEY;

    @Autowired
    public SupplierController(
            SupplierService supplierService,
            SupplierRepository supplierRepository,
            MaterialResourceRepository materialResourceRepository,
            AISentimentService sentimentService,
            AISummarizationService summarizationService
    ) {
        this.supplierService = supplierService;
        this.supplierRepository = supplierRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.sentimentService = sentimentService;
        this.summarizationService = summarizationService;
    }

    // ✅ Get all suppliers
    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAllSuppliers();
    }

    // ✅ Get supplier by ID and increment click count
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        Optional<Supplier> optionalSupplier = supplierRepository.findById(id);

        if (optionalSupplier.isPresent()) {
            Supplier supplier = optionalSupplier.get();
            supplier.setClickCount(supplier.getClickCount() + 1); // 🔥 Increment click count
            supplierRepository.save(supplier); // ✅ Save updated click count
            return ResponseEntity.ok(supplier);
        }

        return ResponseEntity.notFound().build();
    }

    // ✅ Create supplier
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

    // ✅ Summarization Feature using Hugging Face
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarizeNotes(@RequestBody Map<String, String> requestBody) {
        // ✅ Fix: Ensure correct key
        String notes = requestBody.get("inputs");

        if (notes == null || notes.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Notes cannot be empty"));
        }

        // ✅ Fix: Ensure Hugging Face API Key is loaded
        String HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // ✅ Fix: Ensure correct JSON payload
        Map<String, Object> request = new HashMap<>();
        request.put("inputs", notes);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map[]> response = restTemplate.exchange(
                    HUGGINGFACE_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map[].class
            );

            if (response.getBody() != null && response.getBody().length > 0) {
                String summary = (String) response.getBody()[0].get("summary_text");
                return ResponseEntity.ok(Collections.singletonMap("summary", summary));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Failed to retrieve summary."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to summarize notes. Exception: " + e.getMessage()));
        }
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
}
