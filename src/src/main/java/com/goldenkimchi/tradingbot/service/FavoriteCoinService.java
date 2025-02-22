package com.goldenkimchi.tradingbot.service;

import com.goldenkimchi.tradingbot.model.FavoriteCoin;
import com.goldenkimchi.tradingbot.repository.FavoriteCoinRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteCoinService {

    private final FavoriteCoinRepository favoriteCoinRepository;

    public FavoriteCoinService(FavoriteCoinRepository favoriteCoinRepository) {
        this.favoriteCoinRepository = favoriteCoinRepository;
    }

    @Transactional
    public FavoriteCoin addFavorite(String userId, String coinSymbol) {
        // Avoid duplicates by checking if the coin is already favorited for this user.
        Optional<FavoriteCoin> existing = favoriteCoinRepository.findByUserIdAndCoinSymbol(userId, coinSymbol);
        if (existing.isPresent()) {
            return existing.get();
        }
        FavoriteCoin favoriteCoin = new FavoriteCoin(userId, coinSymbol);
        return favoriteCoinRepository.save(favoriteCoin);
    }

    @Transactional
    public void removeFavorite(String userId, String coinSymbol) {
        Optional<FavoriteCoin> existing = favoriteCoinRepository.findByUserIdAndCoinSymbol(userId, coinSymbol);
        existing.ifPresent(favoriteCoinRepository::delete);
    }

    public List<FavoriteCoin> getFavorites(String userId) {
        return favoriteCoinRepository.findAllByUserId(userId);
    }
}
