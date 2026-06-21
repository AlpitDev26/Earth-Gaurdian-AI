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
        
        // Gamification logic
        if(user.getTotalPoints() >= 5000) user.setCurrentLevel("Planet Guardian");
        else if (user.getTotalPoints() >= 2000) user.setCurrentLevel("Forest");
        else if (user.getTotalPoints() >= 500) user.setCurrentLevel("Tree");
        
        userRepository.save(user);
    }
}
