package com.earthguardian.repository;

import com.earthguardian.entity.CarbonLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface CarbonLogRepository extends JpaRepository<CarbonLog, UUID> {
    
    @Query("SELECT SUM(c.carbonAmount) FROM CarbonLog c WHERE c.user.id = :userId AND c.loggedAt >= :startDate")
    Double calculateRecentEmissions(UUID userId, LocalDateTime startDate);
}
