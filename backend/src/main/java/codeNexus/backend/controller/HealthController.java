package codeNexus.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(new ApiResponse("CodeNexus Backend API is running", "v1.0"));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new ApiResponse("CodeNexus Backend API is healthy", "v1.0"));
    }

    static class ApiResponse {
        public String message;
        public String version;

        ApiResponse(String message, String version) {
            this.message = message;
            this.version = version;
        }
    }
}
