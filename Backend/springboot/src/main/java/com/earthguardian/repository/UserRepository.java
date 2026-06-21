package com.earthguardian.repository;

import com.earthguardian.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u ORDER BY u.totalPoints DESC LIMIT 10")
    List<User> findTop10ByOrderByTotalPointsDesc();
}
