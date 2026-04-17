package com.bank.loan.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public NotificationService(JavaMailSender mailSender, @Value("${spring.mail.username:}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendNotifications(String email, String mobileNumber, String referenceNumber, String loanType) {
        String subject = "Loan Application Received";
        String body = "Dear Customer,\n\n" +
                "Your " + loanType + " application has been received successfully.\n" +
                "Reference Number: " + referenceNumber + "\n" +
                "Next Steps: Our team will review your application and contact you shortly.\n\n" +
                "Thank you for choosing our bank.\n";

        if (fromAddress != null && !fromAddress.isBlank()) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromAddress);
                message.setTo(email);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("[EMAIL] Sent notification to " + email);
            } catch (Exception ex) {
                System.out.println("[EMAIL] Could not send email: " + ex.getMessage());
            }
        } else {
            System.out.println("[EMAIL] Mail service not configured. Notification email skipped.");
        }

        System.out.println("[SMS] To: " + mobileNumber + " | " +
                "Loan application received. Ref: " + referenceNumber + ".");
        System.out.println("------------------------------------------------\n");
    }
}
