package com.goldenkimchi.tradingbot.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "favorite_coins")
@NoArgsConstructor
public class FavoriteCoin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    // Identifier for the user – for example, the Google user ID or email.
    @Getter @Setter
    private String userId;

    // The coin symbol (e.g., "BTCUSDT")
    @Getter @Setter
    private String coinSymbol;

    public FavoriteCoin(String userId, String coinSymbol) {
        this.userId = userId;
        this.coinSymbol = coinSymbol;
    }

}