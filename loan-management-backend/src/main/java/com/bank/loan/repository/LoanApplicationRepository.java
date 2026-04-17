package com.bank.loan.repository;

import com.bank.loan.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    boolean existsByMobileNumber(String mobileNumber);
    Optional<LoanApplication> findByReferenceNumber(String referenceNumber);
}
