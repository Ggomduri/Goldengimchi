package com.goldenkimchi.tradingbot.service;


import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BinancePriceService {

    private static final String BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/price?symbol=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> cachedPrices = new ConcurrentHashMap<>();

    //가격정보를 제공하고싶은 코인 추가시 백엔드코드에는 여기에만 추가해주면 됨.
    private static final List<String> COINS = List.of("BTCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT" ,"XRPUSDT");

    public Map<String, String> getCryptoPrices() {
        Map<String, String> prices = new ConcurrentHashMap<>();
        for (String symbol : COINS) {
            try {
                BinancePriceResponse response = restTemplate.getForObject(BINANCE_API_URL + symbol, BinancePriceResponse.class);
                if (response != null) {
                    prices.put(symbol, response.getPrice());
                    cachedPrices.put(symbol, response.getPrice()); // Cache the latest price
                }
            } catch (Exception e) {
                prices.put(symbol, cachedPrices.getOrDefault(symbol, "Unavailable")); // Use last known price if API fails
            }
        }
        return prices;
    }

    @Getter @Setter
    private static class BinancePriceResponse {
        private String price;
    }
}