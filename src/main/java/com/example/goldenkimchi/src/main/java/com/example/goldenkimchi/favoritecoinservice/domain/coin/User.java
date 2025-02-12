package com.example.goldenkimchi.favoritecoinservice.domain.coin;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @Getter
    @ElementCollection
    private Set<String> favoriteCoins = new HashSet<>();

    public void addFavoriteCoin(String coin) { favoriteCoins.add(coin); }
    public void removeFavoriteCoin(String coin) { favoriteCoins.remove(coin); }
    public boolean isFavorite(String coin) { return favoriteCoins.contains(coin); }
}