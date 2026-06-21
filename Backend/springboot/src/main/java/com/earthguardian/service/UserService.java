package com.earthguardian.service;

import com.earthguardian.entity.User;
import com.earthguardian.exception.ResourceNotFoundException;
import com.earthguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User getDefaultUser() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            User user = User.builder()
                    .email("demo@earthguardian.ai")
                    .fullName("EcoHero")
                    .passwordHash("hashed")
                    .totalPoints(0)
                    .currentLevel("Seed")
                    .build();
            return userRepository.save(user);
        }
        return users.get(0);
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public void awardPoints(UUID userId, Integer points) {
        User user = getUserById(userId);
        Integer currentPoints = user.getTotalPoints() != null ? user.getTotalPoints() : 0;
        user.setTotalPoints(currentPoints + points);
        
        // Gamification logic
        if(user.getTotalPoints() >= 5000) user.setCurrentLevel("Planet Guardian");
        else if (user.getTotalPoints() >= 2000) user.setCurrentLevel("Forest");
        else if (user.getTotalPoints() >= 500) user.setCurrentLevel("Tree");
        
        userRepository.save(user);
    }

    @Transactional
    public void updateCarbonImpact(UUID userId, Double impact) {
        User user = getUserById(userId);
        Double currentImpact = user.getTotalCarbonImpact() != null ? user.getTotalCarbonImpact() : 0.0;
        user.setTotalCarbonImpact(currentImpact + impact);
        
        // Dynamic Digital Twin Score Calculation
        // Decrease planet health score by 1 for every 2kg of CO2. Max 100, Min 0.
        int scoreDrop = (int) (user.getTotalCarbonImpact() / 2.0);
        int newScore = Math.max(0, 100 - scoreDrop);
        user.setCurrentCarbonScore(newScore);
        
        userRepository.save(user);
    }
}
