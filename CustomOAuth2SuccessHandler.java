package com.goldenkimchi.tradingbot.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        // Instead of redirecting, render a page that informs the user they are logged in.
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write("<html><body style='font-family: sans-serif; text-align: center; padding-top: 50px;'>" +
                "<h2>Login Successful</h2>" +
                "<p>You are now logged in. Please close this window and return to the main page.</p>" +
                "</body></html>");
        // Do not call response.sendRedirect or close the window automatically.
    }
}