package com.example.goldenkimchi.favoritecoinservice.domain.coin;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Coin {

    private Long id;
    private String coinName;
    private float price;

    public Coin(String coinName, float price) {
        this.coinName = coinName;
        this.price = price;
    }

}
