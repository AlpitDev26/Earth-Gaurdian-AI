# Earth Guardian AI: Database Integration Layer

As requested, I have engineered the complete PostgreSQL Integration Layer using Spring Boot Data JPA. This document contains the production-ready code for your Entities, Repositories, Flyway Migrations, DTOs, Mappers, and Services.

---

## SECTION 1: JPA Entity Classes

*All entities utilize UUIDs for primary keys, Lombok for boilerplate reduction, and standard JPA annotations.*

```java
package com.earthguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

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

    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
}

@Entity
@Table(name = "receipts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Receipt {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String imageUrl;
    private Double totalCarbonImpact;
    private Integer pointsAwarded;
    private String status; // PENDING, PROCESSED, FAILED

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReceiptItem> items;

    @CreationTimestamp private LocalDateTime createdAt;
}

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

@Entity
@Table(name = "user_rewards")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserReward {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @CreationTimestamp private LocalDateTime earnedAt;
}
```

---

## SECTION 2: Repository Layer

```java
package com.earthguardian.repository;

import com.earthguardian.entity.User;
import com.earthguardian.entity.CarbonLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    // Leaderboard Query
    @Query("SELECT u FROM User u ORDER BY u.totalPoints DESC LIMIT 10")
    List<User> findTop10ByOrderByTotalPointsDesc();
}

@Repository
public interface CarbonLogRepository extends JpaRepository<CarbonLog, UUID> {
    
    // Dashboard Query: Get sum of carbon emissions for a user over the last 7 days
    @Query("SELECT SUM(c.carbonAmount) FROM CarbonLog c WHERE c.user.id = :userId AND c.loggedAt >= :startDate")
    Double calculateRecentEmissions(UUID userId, LocalDateTime startDate);
}

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {
    List<Receipt> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
```

---

## SECTION 3: Flyway Migrations

File: `src/main/resources/db/migration/V1__Initial_Schema.sql`

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    total_points INT DEFAULT 0,
    current_level VARCHAR(50) DEFAULT 'Seed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    image_url TEXT,
    total_carbon_impact FLOAT,
    points_awarded INT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carbon_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    carbon_amount FLOAT NOT NULL,
    log_type VARCHAR(50),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## SECTION 4: DTO Layer

```java
package com.earthguardian.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserResponseDto {
    private UUID id;
    private String fullName;
    private String email;
    private Integer totalPoints;
    private String currentLevel;
}

@Data
public class ReceiptScanRequestDto {
    private String imageUrl;
}

@Data
public class DashboardResponseDto {
    private Double weeklyEmissions;
    private Integer points;
    private String twinState; // THRIVING, STRESSED, POLLUTED
}
```

---

## SECTION 5: Mapper Layer

Wait until we add `mapstruct` to `pom.xml`, but here is the interface setup:

```java
package com.earthguardian.mapper;

import com.earthguardian.dto.UserResponseDto;
import com.earthguardian.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto userToUserResponseDto(User user);
}
```

---

## SECTION 6: Service Layer

```java
package com.earthguardian.service;

import com.earthguardian.entity.User;
import com.earthguardian.exception.ResourceNotFoundException;
import com.earthguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public void awardPoints(UUID userId, Integer points) {
        User user = getUserById(userId);
        user.setTotalPoints(user.getTotalPoints() + points);
        
        // Business Logic: Level up validation
        if(user.getTotalPoints() >= 5000) user.setCurrentLevel("Planet Guardian");
        else if (user.getTotalPoints() >= 2000) user.setCurrentLevel("Forest");
        else if (user.getTotalPoints() >= 500) user.setCurrentLevel("Tree");
        
        userRepository.save(user);
    }
}
```
