package com.example.supplier.controller;

import com.example.supplier.service.EmailService;
import com.example.supplier.model.Supplier;
import com.example.supplier.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.MessagingException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "http://localhost:4200")

public class EmailController {

    private final EmailService emailService;
    private final SupplierService supplierService;

    @Autowired
    public EmailController(EmailService emailService, SupplierService supplierService) {
        this.emailService = emailService;
        this.supplierService = supplierService;
    }

    // Endpoint to send a warning email to the supplier
    @PostMapping("/send-warning-email/{id}")
    public ResponseEntity<Map<String, String>> sendWarningEmail(@PathVariable Long id) {
        // Fetch supplier with prediction status
        Supplier supplier = supplierService.getSupplierWithPredictionStatus(id);

        // Log the current prediction status for debugging
        System.out.println("Prediction Status: " + supplier.getPredictionStatus());

        // Check if the supplier's prediction status is inactive
        if ("inactive".equals(supplier.getPredictionStatus())) {
            try {
                // Prepare email details
                String to = supplier.getEmail();
                String subject = "Warning: Your Supplier Status is Inactive";
                String content = "<html>" +
                        "<body style='font-family: Arial, sans-serif;'>" +
                        "<div style='background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;'>" +
                        "<h2 style='color: #007bff;'>Important: Your Supplier Status is at Risk</h2>" +
                        "<p style='font-size: 16px;'>Dear <strong>" + supplier.getName() + "</strong>,</p>" +

                        "<p style='font-size: 16px;'>We are writing to inform you that your account is at risk of becoming inactive in our application, <strong>BuildFlow</strong>.</p>" +

                        "<p style='font-size: 16px; color: #dc3545;'>This means that you may lose access to critical features and the ability to interact with customers.</p>" +

                        "<p style='font-size: 16px;'>To avoid this, please contact us as soon as possible to resolve any issues and ensure your continued access.</p>" +

                        "<p style='font-size: 16px;'>If you have any questions or concerns, do not hesitate to reach out to us at <strong>support@buildflow.com</strong>.</p>" +

                        "<p style='font-size: 16px;'><strong>We value your partnership, and we're here to help!</strong></p>" +

                        "<div style='background-color: #007bff; color: white; padding: 10px; text-align: center; border-radius: 5px;'>" +
                        "<p style='margin: 0;'>If you have already taken action, please ignore this message.</p>" +
                        "</div>" +

                        "<p style='font-size: 14px; color: #6c757d;'>Best regards,</p>" +
                        "<p style='font-size: 14px; color: #6c757d;'>The BuildFlow Team</p>" +
                        "<p style='font-size: 12px; color: #6c757d;'>This is an automated message. Please do not reply to this email directly.</p>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

                // Send the email
                emailService.sendEmail(to, subject, content);

                // Create a response map with success message
                Map<String, String> response = new HashMap<>();
                response.put("message", "Warning email sent to " + supplier.getName());

                return ResponseEntity.ok(response);  // Return JSON response with status 200

            } catch (MessagingException e) {
                // Handle error and return a JSON response with the error message
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Error sending email: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        } else {
            // If supplier is not inactive, return a response indicating no email was sent
            Map<String, String> response = new HashMap<>();
            response.put("message", "The supplier is not inactive, no email sent.");
            return ResponseEntity.ok(response);  // Return JSON response with status 200
        }
    }


    @PostMapping("/send-test-email")
    public String sendTestEmail() {
        try {
            emailService.sendEmail("benelkaabarij@gmail.com", "Test Subject", "This is a test email body.");
            return "Test email sent!";
        } catch (MessagingException e) {
            return "Error sending test email: " + e.getMessage();
        }
    }



}
