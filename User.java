package com.goldenkimchi.tradingbot.entity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table (name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    private String email;

    @Getter
    @ElementCollection
    private Set<String> favoriteCoins = new HashSet<>();

    public void addFavoriteCoin(String coin) { favoriteCoins.add(coin); }
    public void removeFavoriteCoin(String coin) { favoriteCoins.remove(coin); }
    public boolean isFavorite(String coin) { return favoriteCoins.contains(coin); }
}
