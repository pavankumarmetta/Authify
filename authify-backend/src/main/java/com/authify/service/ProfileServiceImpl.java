package com.authify.service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.authify.entity.UserEntity;
import com.authify.io.ProfileRequest;
import com.authify.io.ProfileResponse;
import com.authify.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ================= REGISTER =================
    @Override
    public ProfileResponse createProfile(ProfileRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        UserEntity newUser = convertToUserEntity(request);
        userRepo.save(newUser);

        return convertToProfileResponse(newUser);
    }

    // ================= PROFILE =================
    @Override
    public ProfileResponse getProfile(String email) {

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email)
                );

        return convertToProfileResponse(user);
    }

    // ================= SEND RESET OTP =================
    @Override
    public void sendResetOtp(String email) {

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email)
                );

        String otp = String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        long expireTime = System.currentTimeMillis() + (15 * 60 * 1000);

        user.setResetOtp(otp);
        user.setResetOtpExpireAt(expireTime);
        userRepo.save(user);

        try {
            emailService.sendResetOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to send OTP email"
            );
        }
    }

    // ================= SEND VERIFY OTP =================
    @Override
    public void sendOtp(String email) {

        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                    new UsernameNotFoundException("User not found: " + email));

        if (Boolean.TRUE.equals(user.getIsAccountVerified())) {
            return;
        }

        String otp = String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        long expireTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        user.setVerifyOtp(otp);
        user.setVerifyOtpExpireAt(expireTime);

        userRepo.save(user);

        try {
            emailService.sendVerifyOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send verification email");
        }
    }
    // ================= RESET PASSWORD =================
    @Override
    public void resetPassword(String email, String otp, String newPassword) {

        UserEntity existingUser = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getResetOtp() == null
                || !existingUser.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepo.save(existingUser);
    }

    // ================= VERIFY OTP =================
    @Override
    public void verifyOtp(String email, String otp) {
    	UserEntity existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: "+email));
        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
          
        // validation check for otp expire validation check
        if (existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepo.save(existingUser);
    }

    // ================= HELPERS =================
    private ProfileResponse convertToProfileResponse(UserEntity user) {
        return ProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getUserId())
                .isAccountVerified(user.getIsAccountVerified())
                .build();
    }

    private UserEntity convertToUserEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(java.util.UUID.randomUUID().toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .resetOtp(null)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .build();
    }
}
