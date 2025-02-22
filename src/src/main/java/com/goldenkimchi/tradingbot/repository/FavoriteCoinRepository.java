package com.goldenkimchi.tradingbot.repository;

import com.goldenkimchi.tradingbot.model.FavoriteCoin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteCoinRepository extends JpaRepository<FavoriteCoin, Long> {
    Optional<FavoriteCoin> findByUserIdAndCoinSymbol(String userId, String coinSymbol);
    List<FavoriteCoin> findAllByUserId(String userId);
}