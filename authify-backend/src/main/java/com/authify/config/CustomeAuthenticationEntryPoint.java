package com.authify.config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomeAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {

    	  // debug line
    	  System.out.println("ENTRY POINT HIT: " + request.getRequestURI());
    	
        String path = request.getRequestURI();

        if (
            path.startsWith("/api/v1.0/login") ||
            path.startsWith("/api/v1.0/register") ||
            path.startsWith("/api/v1.0/send-reset-otp") ||
            path.startsWith("/api/v1.0/reset-password")
        ) {
            response.setStatus(HttpServletResponse.SC_OK); // stops 401 error
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
            "{\"authenticated\": false, \"message\": \"User is not authenticated\"}"
        );
    }
}

