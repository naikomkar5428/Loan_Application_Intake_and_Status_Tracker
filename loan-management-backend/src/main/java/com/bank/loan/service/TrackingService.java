package com.bank.loan.service;

import com.bank.loan.entity.LoanApplication;
import com.bank.loan.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;

@Service
public class TrackingService {

    private final LoanApplicationRepository repository;

    public TrackingService(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    public Object trackApplication(String referenceNumber) {
        LoanApplication application = repository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Reference Number"));
        return application;
    }
}
