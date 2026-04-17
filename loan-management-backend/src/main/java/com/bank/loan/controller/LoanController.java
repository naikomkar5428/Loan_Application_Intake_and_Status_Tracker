package com.bank.loan.controller;

import com.bank.loan.dto.LoanRequest;
import com.bank.loan.dto.LoanResponse;
import com.bank.loan.entity.LoanApplication;
import com.bank.loan.service.DocumentService;
import com.bank.loan.service.LoanService;
import com.bank.loan.service.TrackingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/loan")
public class LoanController {

    private final LoanService loanService;
    private final TrackingService trackingService;
    private final DocumentService documentService;

    public LoanController(LoanService loanService, TrackingService trackingService, DocumentService documentService) {
        this.loanService = loanService;
        this.trackingService = trackingService;
        this.documentService = documentService;
    }

    @PostMapping("/apply")
    public ResponseEntity<LoanResponse> apply(@Valid @RequestBody LoanRequest request) {
        LoanResponse response = loanService.apply(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/status/{referenceNumber}")
    public ResponseEntity<?> trackApplication(@PathVariable String referenceNumber) {
        LoanApplication statusObj = (LoanApplication) trackingService.trackApplication(referenceNumber);
        String status = statusObj.getStatus();

        if ("Business Loan".equals(statusObj.getLoanType()) && "RECEIVED".equals(status)) {
            status = "Additional Documents Required";
        } else if ("Home Loan".equals(statusObj.getLoanType()) && "RECEIVED".equals(status)) {
            status = "Under Review";
        } else if ("RECEIVED".equals(status)) {
            status = "Received";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("referenceNumber", statusObj.getReferenceNumber());
        response.put("fullName", statusObj.getFullName());
        response.put("loanType", statusObj.getLoanType());
        response.put("loanAmount", statusObj.getLoanAmount());
        response.put("status", status);
        response.put("submissionDate", statusObj.getCreatedAt().toString());

        if ("Additional Documents Required".equals(status)) {
            response.put("missingDocuments", documentService.getPendingDocuments());
        }

        return ResponseEntity.ok(response);
    }
}
