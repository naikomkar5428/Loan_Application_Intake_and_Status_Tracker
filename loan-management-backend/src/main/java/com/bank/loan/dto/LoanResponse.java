package com.bank.loan.dto;

public class LoanResponse {
    private String status;
    private String referenceNumber;
    private String message;
    private String nextSteps;

    public LoanResponse() {
    }

    public LoanResponse(String status, String referenceNumber, String message, String nextSteps) {
        this.status = status;
        this.referenceNumber = referenceNumber;
        this.message = message;
        this.nextSteps = nextSteps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(String nextSteps) {
        this.nextSteps = nextSteps;
    }
}
