package com.example.sprinproject.auth;
import com.example.sprinproject.user.Token;
import com.example.sprinproject.user.User;
import com.example.sprinproject.user.userRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.web.exchanges.HttpExchange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
@RequiredArgsConstructor

public class AuthenticationController {
    private final AuthenticationService authService;
    private final userRepository userRepository;


    @PostMapping("/Register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
        List<String> roles = List.of("USER");
        authService.register(request, roles);
        return ResponseEntity.accepted().build();

    }
    @PostMapping("/google")
    public ResponseEntity<AuthenficationResponse> authenticateWithGoogle(
            @RequestParam String  googleToken
    ) throws IOException, GeneralSecurityException {
        return ResponseEntity.ok(authService.authenticateWithGoogle(googleToken));
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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) throws MessagingException {
        authService.forgotPassword(email);
        return ResponseEntity.ok("Password reset link sent to email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        try {
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok().body(
                    Map.of("message", "Password has been reset successfully")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        try {
            User updatedUser = authService.updatePassword(resetPasswordDto);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

}