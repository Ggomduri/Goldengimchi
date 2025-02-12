package com.example.goldenkimchi.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final Map<String, Set<String>> userFavorites = new ConcurrentHashMap<>();

    @PostMapping("/{coin}")
    public String addFavorite(@AuthenticationPrincipal OAuth2User user, @PathVariable String coin) {
        if (user == null) {
            throw new RuntimeException("User not logged in");
        }
        String email = user.getAttribute("email");
        userFavorites.putIfAbsent(email, new HashSet<>());
        if (!userFavorites.get(email).add(coin)) {
            userFavorites.get(email).remove(coin); // Toggle favorite
        }
        return "Updated favorites";
    }

    @GetMapping
    public Set<String> getFavorites(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            throw new RuntimeException("User not logged in");
        }
        return userFavorites.getOrDefault(user.getAttribute("email"), Set.of());
    }
}