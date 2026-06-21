package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "rewards")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Reward {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String title;
    private String description;
    private Integer pointValue;
    private String iconKey;
}
