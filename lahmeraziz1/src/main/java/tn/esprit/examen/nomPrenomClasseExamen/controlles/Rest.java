    package tn.esprit.examen.nomPrenomClasseExamen.controlles;

    import lombok.AllArgsConstructor;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import tn.esprit.examen.nomPrenomClasseExamen.entities.Facture;
    import tn.esprit.examen.nomPrenomClasseExamen.services.Servicelahmer;

    import java.util.List;
    import java.util.Map;

    @AllArgsConstructor
    @RestController
    @CrossOrigin(origins = "http://localhost:4200")

    @RequestMapping("/Rest")

    public class Rest {
        @Autowired
        private Servicelahmer servicelahmer;

        @PostMapping("/ajouterFacture")
        public Facture ajouterFacture(@RequestBody Facture facture) {
            return servicelahmer.ajouterFacture(facture);
        }
        @PutMapping("/updateFacture")
        public Facture updateFacture(@RequestBody Facture facture) {
            return servicelahmer.updateFacture(facture);
        }
        @GetMapping("/getAllFacture")
        public List<Facture> retrieveAllFacture() {
            return servicelahmer.retrieveAllFacture();
        }
        @GetMapping("/findById/{idF}")
        public Facture retrieveById(@PathVariable long idF) {
            return servicelahmer.retrieveFactureById(idF);
        }

        @DeleteMapping("/deleteE/{idF}")
        public void deleteFactureById(@PathVariable long idF) {
            servicelahmer.deleteFactureById(idF);
        }
        @GetMapping("/stats-etat")
        public ResponseEntity<Map<String, Long>> getStatistiquesParEtat() {
            Map<String, Long> stats = servicelahmer.getNombreFacturesParEtat();
            return ResponseEntity.ok(stats);
        }

        @GetMapping("/rates")
        public ResponseEntity<?> getRates() {
            try {
                return ResponseEntity.ok(servicelahmer.getExchangeRates());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "error", "Failed to get USD rates",
                                "reason", e.getMessage(),
                                "solution", "1. Verify API key 2. Check service status"
                        )
                );
            }
        }

        @GetMapping("/predictaziz")
        public ResponseEntity<String> predict(@RequestParam double montant, @RequestParam String dateEmission) {
            String result = servicelahmer.getPredictedDateEcheance(montant, dateEmission);
            return ResponseEntity.ok("Date d'échéance prédite : " + result);
        }





    }
