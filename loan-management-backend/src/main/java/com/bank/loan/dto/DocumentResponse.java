package com.bank.loan.dto;

import java.util.List;

public class DocumentResponse {
    private String status;
    private List<String> pendingDocuments;

    public DocumentResponse() {
    }

    public DocumentResponse(String status, List<String> pendingDocuments) {
        this.status = status;
        this.pendingDocuments = pendingDocuments;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getPendingDocuments() {
        return pendingDocuments;
    }

    public void setPendingDocuments(List<String> pendingDocuments) {
        this.pendingDocuments = pendingDocuments;
    }
}
