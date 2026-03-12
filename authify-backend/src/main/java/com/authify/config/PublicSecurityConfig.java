package com.authify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Order(1)
public class PublicSecurityConfig {

    @Bean
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {

        http
            .securityMatcher(
                "/api/v1.0/login",
                "/api/v1.0/register",
                "/api/v1.0/send-reset-otp",
                "/api/v1.0/reset-password",
                "/api/v1.0/is-authenticated"
            )
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())   // ✅ IMPORTANT
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
