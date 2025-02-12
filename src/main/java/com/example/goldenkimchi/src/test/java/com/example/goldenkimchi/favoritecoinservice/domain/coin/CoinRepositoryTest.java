package com.example.goldenkimchi.favoritecoinservice.domain.coin;

import com.example.goldenkimchi.reository.CoinRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class CoinRepositoryTest {

    CoinRepository coinRepository = new CoinRepository();

    @AfterEach
    void afterEach() {
        coinRepository.clearMyFavorite();
    }

    @Test
    void save() {
        //given
        Coin coin = new Coin("BTC", 100000);

        //when
        Coin savedCoin = coinRepository.findById(coin.getId());

        //then
        Coin findCoin = coinRepository.findById(coin.getId());
        assertThat(findCoin).isEqualTo(savedCoin);
    }

    @Test
    void findAll() {
        //given
        Coin BTC = new Coin("BTC", 100000);
        Coin ETH = new Coin("ETH", 3000);
        coinRepository.save(BTC);
        coinRepository.save(ETH);

        //when
        List<Coin> result = coinRepository.findAll();

        //then
        assertThat(result.size()).isEqualTo(2);
        assertThat(result).contains(BTC, ETH);
    }

    @Test
    void updateCoin() {
        //given
        Coin coin = new Coin("BTC", 100000);
        Coin savedCoin = coinRepository.save(coin);
        Long coinId = savedCoin.getId();

        //when
        Coin updateParm = new Coin("ETH", 4000);
        coinRepository.update(coinId, updateParm);

        Coin coinFound = coinRepository.findById(coinId);

        //then
        assertThat(coinFound.getCoinName()).isEqualTo(updateParm.getCoinName());
        assertThat(coinFound.getPrice()).isEqualTo(updateParm.getPrice());

    }

}
