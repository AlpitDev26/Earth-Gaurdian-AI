package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;
    private String passwordHash;
    private String fullName;
    
    @Builder.Default
    private Integer totalPoints = 0;
    
    @Builder.Default
    private String currentLevel = "Seed";

    @Builder.Default
    private Integer currentCarbonScore = 100;

    @Builder.Default
    private Double totalCarbonImpact = 0.0;

    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}
