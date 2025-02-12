package com.example.goldenkimchi.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return Map.of("authenticated", false);
        }
        return Map.of(
                "authenticated", true,
                "email", user.getAttribute("email")
        );
    }
}
