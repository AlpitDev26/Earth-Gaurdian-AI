package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "carbon_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CarbonLog {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double carbonAmount; // In kg
    private String logType; // e.g., RECEIPT_SCAN, MANUAL_ENTRY
    
    @CreationTimestamp private LocalDateTime loggedAt;
}
