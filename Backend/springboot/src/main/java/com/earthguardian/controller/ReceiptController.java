package com.earthguardian.controller;

import com.earthguardian.dto.ApiResponse;
import com.earthguardian.service.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scanReceipt(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = receiptService.processReceipt(file);
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(result)
                .build());
    }
}
