package com.authify.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.authify.io.AuthRequest;
import com.authify.io.ResetPasswordRequest;
import com.authify.service.AppUserDetailsService;
import com.authify.service.ProfileService;
import com.authify.util.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserDetailsService appUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        UserDetails userDetails;

        try {
            userDetails = appUserDetailsService
                    .loadUserByUsername(request.getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid credentials"));
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                userDetails.getPassword())) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateTokens(userDetails);

        return ResponseEntity.ok(
                Map.of(
                    "token", token,
                    "message", "Login successful"
                )
        );
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        // For JWT + LocalStorage, backend just returns success
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    // ================= AUTH CHECK =================
    @GetMapping("/is-authenticated")
    public ResponseEntity<Boolean> isAuthenticated(
            @CurrentSecurityContext(expression = "authentication?.name") String email) {

        return ResponseEntity.ok(email != null);
    }

    // ================= SEND RESET OTP =================
    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email) {

        try {
            profileService.sendResetOtp(email); // ✅ CORRECT
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public void resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        try {
            profileService.resetPassword(
                    request.getEmail(),
                    request.getOtp(),
                    request.getNewPassword()
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request,
            @CurrentSecurityContext(expression = "authentication?.name") String email
    ) {

        String otp = request.get("otp");

        if (otp == null || otp.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP is required"));
        }

        try {
            profileService.verifyOtp(email, otp);

            return ResponseEntity.ok(
                    Map.of("message", "Email verified successfully")
            );

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
