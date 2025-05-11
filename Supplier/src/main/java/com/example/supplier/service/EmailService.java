package com.example.supplier.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    // Method to send an email with a subject and content
    public void sendEmail(String to, String subject, String content) throws MessagingException {
        // Create a MimeMessage object
        MimeMessage message = javaMailSender.createMimeMessage();

        // Create a helper to set the email details
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("benelkaab.arij@gmail.com");  // Sender email
        helper.setTo(to);  // Recipient email
        helper.setSubject(subject);  // Subject
        helper.setText(content, true);  // Email content (true for HTML content)

        // Send the email
        javaMailSender.send(message);
    }
}
