package com.example.sprinproject.auth;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
@RequiredArgsConstructor

public class AuthenticationController {
    private final AuthenticationService authService;


    @PostMapping("/Register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
        List<String> roles = List.of("USER");
        authService.register(request, roles);
        return ResponseEntity.accepted().build();

    }
    @PostMapping("/authenticate")
    private ResponseEntity<AuthenficationResponse> authenticate(
            @RequestBody @Valid AuthenficationRequest request
    ){
        return ResponseEntity.ok(authService.authenficate(request));
    }
    @GetMapping("activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        authService.activateaccount(token);
    }
}