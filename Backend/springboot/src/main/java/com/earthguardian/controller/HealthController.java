package com.earthguardian.controller;

import com.earthguardian.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> data = Map.of(
                "status", "UP",
                "service", "Earth Guardian Core APIs"
        );
        
        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("Service is running optimally")
                .data(data)
                .build();
                
        return ResponseEntity.ok(response);
    }
}
