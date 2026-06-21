package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "simulations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Simulation {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer meatDays;
    private Integer transitDays;
    private Double solarPercentage;
    private Double projectedSavings; // kg CO2
    
    @CreationTimestamp private LocalDateTime createdAt;
}
