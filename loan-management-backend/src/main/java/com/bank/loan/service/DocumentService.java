package com.bank.loan.service;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocumentService {
    
    // HARDCODED pending documents list as defined in specifications
    private static final List<String> PENDING_DOCUMENTS = List.of(
            "Aadhaar Card",
            "Salary Slips",
            "Bank Statement",
            "Property Documents"
    );

    public List<String> getPendingDocuments() {
        return PENDING_DOCUMENTS;
    }
}
