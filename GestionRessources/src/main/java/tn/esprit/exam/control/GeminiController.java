package tn.esprit.exam.control;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.exam.entity.MaterialResources;
import tn.esprit.exam.service.GeminiService;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    public String chatAboutMaterials(@RequestBody String userPrompt) {
        return geminiService.chatAboutMaterials(userPrompt);
    }

    // 🔹 Chat sur une ressource spécifique par ID
    @PostMapping("/chat/{materialId}")
    public String chatAboutMaterial(@PathVariable Long materialId, @RequestBody String userPrompt) {
        return geminiService.chatAboutMaterial(materialId, userPrompt);
    }
}