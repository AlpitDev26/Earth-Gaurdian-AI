package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "receipt_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ReceiptItem {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private Receipt receipt;

    private String itemName;
    private Double carbonFootprint;
    private String category;
}
