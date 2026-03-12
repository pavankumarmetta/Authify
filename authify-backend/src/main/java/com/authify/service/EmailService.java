package com.authify.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String name) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("pavankumarmetta01@gmail.com"); // ✅ VERIFIED SENDER
        message.setTo(toEmail);
        message.setSubject("Welcome to Our Platform");
        message.setText(
                "Hello " + name +
                ",\n\nThanks for registering with us!" +
                "\n\nRegards,\nAuthify Team"
        );

        mailSender.send(message);
        System.out.println("Welcome email sent to " + toEmail);
    }
    public void sendResetOtpEmail(String toEmail, String otp)
    {
    	SimpleMailMessage message = new SimpleMailMessage();
    	message.setFrom("pavankumarmetta01@gmail.com");
    	message.setTo(toEmail);
    	message.setSubject("Password Reset OTP");
    	message.setText("Your OTP for resetting you password is "+otp+" Use this otp to proceed with resetting your password. ");
    	mailSender.send(message);
    }
    
    public void sendVerifyOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("pavankumarmetta01@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Email Verification OTP");

        message.setText(
            "Your email verification OTP is: " + otp +
            "\n\nThis OTP is valid for 24 hours."
        );

        mailSender.send(message);
    }	
}
