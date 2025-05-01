package tn.esprit.exam.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Bean;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public String geminiApiKey() {
        return apiKey;
    }
}