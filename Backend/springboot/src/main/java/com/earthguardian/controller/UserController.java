package com.earthguardian.controller;

import com.earthguardian.entity.User;
import com.earthguardian.service.UserService;
import com.earthguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getDefaultUser());
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> resetGamification() {
        User user = userService.getDefaultUser();
        user.setTotalPoints(0);
        user.setCurrentLevel("Seed");
        user.setTotalCarbonImpact(0.0);
        user.setCurrentCarbonScore(100);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
