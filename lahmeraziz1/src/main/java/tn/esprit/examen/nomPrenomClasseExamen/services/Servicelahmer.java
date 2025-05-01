package tn.esprit.examen.nomPrenomClasseExamen.services;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Facture;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.IFactureRespository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Data
@RequiredArgsConstructor
public class Servicelahmer {

    @Autowired
    private IFactureRespository factureRespository;

    @Value("${exchange.api.url}")
    private String apiUrl;

    @Value("${exchange.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();



    // CRUD Facture
    public Facture ajouterFacture(Facture f) {
        return factureRespository.save(f);
    }

    public Facture updateFacture(Facture facture) {
        return factureRespository.save(facture);
    }

    public List<Facture> retrieveAllFacture() {
        return factureRespository.findAll();
    }

    public Facture retrieveFactureById(long idF) {
        return factureRespository.findById(idF).orElse(null);
    }

    public void deleteFactureById(long idF) {
        factureRespository.deleteById(idF);
    }

    public Map<String, Long> getNombreFacturesParEtat() {
        return factureRespository.findAll().stream()
                .collect(Collectors.groupingBy(
                        facture -> facture.getEtatFacture().toString(),
                        Collectors.counting()
                ));
    }

    public Map<String, Object> getExchangeRates() {
        try {
            // Build URL with access_key parameter
            String url = String.format("%s?access_key=%s",
                    apiUrl,
                    apiKey
            );

            // Make the request (no headers needed)
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );

            // Validate response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();

                // Check for API errors
                if (body.containsKey("error")) {
                    throw new RuntimeException(
                            "API Error: " + body.get("error").toString()
                    );
                }
                return body;
            }
            throw new RuntimeException("HTTP Error: " + response.getStatusCode());

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch rates: " + e.getMessage());
        }
    }



}
