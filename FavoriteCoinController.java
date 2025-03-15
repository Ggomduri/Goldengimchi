package com.goldenkimchi.tradingbot.controller;


import com.goldenkimchi.tradingbot.entity.FavoriteCoin;
import com.goldenkimchi.tradingbot.service.FavoriteCoinService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteCoinController {

    private final FavoriteCoinService favoriteCoinService;

    public FavoriteCoinController(FavoriteCoinService favoriteCoinService) {
        this.favoriteCoinService = favoriteCoinService;
    }

    // Endpoint to add a favorite coin.
    // Expects a JSON body with a "coin" field.
    @PostMapping
    public FavoriteCoin addFavorite(@RequestBody FavoriteCoinRequest request, Authentication authentication) {
        // Get the user ID from the authenticated principal.
        String userId = authentication.getName();
        return favoriteCoinService.addFavorite(userId, request.getCoin());
    }

    // Endpoint to remove a favorite coin.
    @DeleteMapping("/{coin}")
    public void removeFavorite(@PathVariable String coin, Authentication authentication) {
        String userId = authentication.getName();
        favoriteCoinService.removeFavorite(userId, coin);
    }

    // Optional: Endpoint to list all favorite coins for the logged-in user.
    @GetMapping
    public List<FavoriteCoin> getFavorites(Authentication authentication) {
        String userId = authentication.getName();
        return favoriteCoinService.getFavorites(userId);
    }

    // DTO for favorite coin request.
    public static class FavoriteCoinRequest {
        private String coin;

        public String getCoin() {
            return coin;
        }

        public void setCoin(String coin) {
            this.coin = coin;
        }
    }
}