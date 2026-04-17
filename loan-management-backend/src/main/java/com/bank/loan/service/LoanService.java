package com.bank.loan.service;

import com.bank.loan.dto.LoanRequest;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.entity.LoanApplication;
import com.bank.loan.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Random;

@Service
public class LoanService {

    private final LoanApplicationRepository repository;
    private final NotificationService notificationService;
    private static final DateTimeFormatter DOB_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final Random RANDOM = new Random();
    private static final List<String> SUPPORTED_LOAN_TYPES = List.of("Home Loan", "Personal Loan", "Business Loan");

    public LoanService(LoanApplicationRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    public LoanResponse apply(LoanRequest req) {
        validateRequest(req);

        if (repository.existsByMobileNumber(req.getMobileNumber())) {
            throw new IllegalArgumentException("An active application already exists for this contact number.");
        }

        String prefix;
        switch (req.getLoanType()) {
            case "Home Loan" -> prefix = "HL";
            case "Personal Loan" -> prefix = "PL";
            case "Business Loan" -> prefix = "BL";
            default -> prefix = "LN";
        }

        String referenceNumber = prefix + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + String.format("%04d", RANDOM.nextInt(10000));

        LoanApplication application = new LoanApplication();
        application.setReferenceNumber(referenceNumber);
        application.setLoanType(req.getLoanType());
        application.setFullName(req.getFullName());
        application.setEmail(req.getEmail());
        application.setMobileNumber(req.getMobileNumber());
        application.setDateOfBirth(req.getDateOfBirth());
        application.setLoanAmount(req.getLoanAmount());
        application.setPropertyValue(req.getPropertyValue());
        application.setEmploymentType(req.getEmploymentType());
        application.setSalary(req.getSalary());
        application.setLoanPurpose(req.getLoanPurpose());
        application.setCompanyName(req.getCompanyName());
        application.setRegistrationNumber(req.getRegistrationNumber());
        application.setAnnualTurnover(req.getAnnualTurnover());
        application.setStatus("RECEIVED");

        repository.save(application);
        notificationService.sendNotifications(application.getEmail(), application.getMobileNumber(), application.getReferenceNumber(), application.getLoanType());

        return new LoanResponse("SUCCESS", referenceNumber, "Loan application submitted successfully", "Our team will review your application and contact you shortly.");
    }

    private void validateRequest(LoanRequest req) {
        if (req.getLoanType() == null || req.getLoanType().isBlank()) {
            throw new IllegalArgumentException("Loan type is required.");
        }

        if (!SUPPORTED_LOAN_TYPES.contains(req.getLoanType())) {
            throw new IllegalArgumentException("Unsupported loan type.");
        }

        try {
            LocalDate birthDate = LocalDate.parse(req.getDateOfBirth(), DOB_FORMATTER);
            if (Period.between(birthDate, LocalDate.now()).getYears() < 18) {
                throw new IllegalArgumentException("Applicant must be at least 18 years old.");
            }
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Date of Birth must be in DD-MM-YYYY format.");
        }

        if (req.getLoanAmount() == null || req.getLoanAmount() <= 0) {
            throw new IllegalArgumentException("Loan amount must be greater than zero.");
        }

        if (req.getLoanType().equals("Home Loan")) {
            if (req.getPropertyValue() == null || req.getPropertyValue() <= 0) {
                throw new IllegalArgumentException("Property value is required for Home Loan.");
            }
            if (req.getEmploymentType() == null || req.getEmploymentType().isBlank()) {
                throw new IllegalArgumentException("Employment type is required for Home Loan.");
            }
        }

        if (req.getLoanType().equals("Personal Loan")) {
            if (req.getSalary() == null || req.getSalary() <= 0) {
                throw new IllegalArgumentException("Monthly income is required for Personal Loan.");
            }
            if (req.getLoanPurpose() == null || req.getLoanPurpose().isBlank()) {
                throw new IllegalArgumentException("Loan purpose is required for Personal Loan.");
            }
        }

        if (req.getLoanType().equals("Business Loan")) {
            if (req.getCompanyName() == null || req.getCompanyName().isBlank()) {
                throw new IllegalArgumentException("Company name is required for Business Loan.");
            }
            if (req.getRegistrationNumber() == null || req.getRegistrationNumber().isBlank()) {
                throw new IllegalArgumentException("Registration number is required for Business Loan.");
            }
            if (req.getAnnualTurnover() == null || req.getAnnualTurnover() <= 0) {
                throw new IllegalArgumentException("Annual turnover is required for Business Loan.");
            }
        }
    }
}
