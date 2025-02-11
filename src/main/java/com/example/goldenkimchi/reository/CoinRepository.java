package com.example.goldenkimchi.reository;


import com.example.goldenkimchi.favoritecoinservice.domain.coin.Coin;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class CoinRepository {
    private static final ConcurrentHashMap<Long, Coin> myFavorite = new ConcurrentHashMap<>();
    //동시성문제를 해결하기위해 그냥 Map이 아니라 ConccurentHashMap을 썼다. 왜?
    private static final AtomicLong sequence = new AtomicLong(0);
    //동시성문제를 해결하기위해 그냥 long이 아니라 AtomicLong을 썼다. 왜?

    public Coin save(Coin coin) {
        coin.setId(sequence.incrementAndGet());
        myFavorite.put(coin.getId(), coin);
        return coin;
        //save 메소드가 coin을 return해야하나? return값이 없거나 id를 반환하면 안되나?
    }

    public Coin findById(Long id) {
        return myFavorite.get(id);
    }

    public List<Coin> findAll() {
        return new ArrayList<>(myFavorite.values());
    }

    public void update(Long coinId, Coin updateParam) {
        Coin findCoin = findById(coinId);
        findCoin.setCoinName(updateParam.getCoinName());
        findCoin.setPrice(updateParam.getPrice());
    }

    public void clearMyFavorite() {
        myFavorite.clear();
    }

}
