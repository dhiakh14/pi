package com.example.sprinproject.auth;

import com.example.sprinproject.email.EmailService;
import com.example.sprinproject.email.EmailTemplateName;
import com.example.sprinproject.role.Role;
import com.example.sprinproject.role.RoleRepository;
import com.example.sprinproject.security.JwtService;
import com.example.sprinproject.user.Token;
import com.example.sprinproject.user.TokenRepository;
import com.example.sprinproject.user.User;
import com.example.sprinproject.user.userRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class AuthenticationService {
    private final RoleRepository role;
    private final PasswordEncoder passwordEncoder;
    private final userRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;




    public void register(RegistrationRequest request, List<String> roleNames) throws MessagingException {
        List<Role> roles = roleNames.stream()
                .map(roleName -> role.findByName(roleName.toUpperCase())
                        .orElseThrow(() -> new IllegalStateException("Role " + roleName + " was not initialized")))
                .collect(Collectors.toList());

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(new HashSet<>(roles))
                .build();
        userRepository.save(user);
        sendValidationEmail(user);
    }


    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        emailService.SendEmail(
                user.getEmail(),
                user.FullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "account activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken =generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codebuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i=0 ; i < length; i++){
            int randomIndex = secureRandom.nextInt(characters.length());
            codebuilder.append(characters.charAt(randomIndex));
        }
        return codebuilder.toString();


    }

    public AuthenficationResponse authenficate(AuthenficationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        var claims= new HashMap<String , Object>();
        var user = ((User)auth.getPrincipal());
        claims.put("fullName", user.FullName());
        claims.put("dateOfBirth", user.getDateOfBirth());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenficationResponse.builder().token(jwtToken).build();
    }


    public void activateaccount(String token) throws MessagingException {
        Token savedToken= tokenRepository.findByToken(token).orElseThrow(()-> new RuntimeException("Invalid Token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())){
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation Token Has Expired. A new Token has been send to the same email address");

        }
        var user = userRepository.findById(savedToken.getUser().getIdUser()).orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

    }
}