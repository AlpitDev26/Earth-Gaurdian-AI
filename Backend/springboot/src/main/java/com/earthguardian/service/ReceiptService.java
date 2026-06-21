package com.earthguardian.service;

import com.earthguardian.entity.CarbonLog;
import com.earthguardian.entity.Receipt;
import com.earthguardian.entity.User;
import com.earthguardian.repository.CarbonLogRepository;
import com.earthguardian.repository.ReceiptRepository;
import com.earthguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final UserRepository userRepository;
    private final ReceiptRepository receiptRepository;
    private final CarbonLogRepository carbonLogRepository;
    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public Map<String, Object> processReceipt(MultipartFile file) {
        try {
            // Securely proxy the image to the internal AI microservice
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt.jpg";
                }
            });
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            String fastApiUrl = "http://localhost:8000/api/v1/scan-receipt";
            
            ResponseEntity<Map> response = restTemplate.postForEntity(fastApiUrl, requestEntity, Map.class);
            Map<String, Object> fastApiData = response.getBody();

            // Fetch or Create Default User (for hackathon demo without login)
            User user = userService.getDefaultUser();

            // Save Receipt and Gamification
            if (fastApiData != null && fastApiData.containsKey("total_carbon")) {
                double totalCarbon = Double.parseDouble(fastApiData.get("total_carbon").toString());

                Receipt receipt = Receipt.builder()
                        .user(user)
                        .totalCarbonImpact(totalCarbon)
                        .pointsAwarded(50)
                        .status("PROCESSED")
                        .build();
                receiptRepository.save(receipt);

                CarbonLog log = CarbonLog.builder()
                        .user(user)
                        .logType("RECEIPT_SCAN")
                        .carbonAmount(totalCarbon)
                        .build();
                carbonLogRepository.save(log);

                // Award 50 points per receipt scanned
                userService.awardPoints(user.getId(), 50);
                
                // Degrade Digital Twin based on CO2 generated
                userService.updateCarbonImpact(user.getId(), totalCarbon);
            }

            return fastApiData;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to reach AI service: " + e.getMessage());
        }
    }
}
