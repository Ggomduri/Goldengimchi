package com.goldenkimchi.tradingbot.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/portfolio")
    public String getUserPortfolio() {
        return "User's Bitcoin portfolio data.";
    }

    @GetMapping("/info")
    public Map<String, String> getUserInfo(@AuthenticationPrincipal OAuth2User principal) {
        //일단 Map대신 ConcurrentHashMap적용
        Map<String, String> userInfo = new ConcurrentHashMap<>();
        if (principal != null) {
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            // Fallback to email prefix if name is missing.
            if ((name == null || name.isEmpty()) && email != null) {
                name = email.split("@")[0];
            }
            userInfo.put("email", email);
            userInfo.put("name", name);
        }
        return userInfo;
    }
}