package com.authify.mail;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authify.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MailTestController {

    private final EmailService emailService;

    @GetMapping("/test-mail")
    public String testMail() {
        emailService.sendWelcomeEmail(
            "2300033669@kluniversity.in",
            "pavan"
        );
        return "Mail sent";
    }
}
