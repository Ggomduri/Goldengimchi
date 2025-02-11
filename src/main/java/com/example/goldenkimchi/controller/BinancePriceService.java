package com.example.goldenkimchi.controller;

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

    //BTC뿐만 아니라 다른 코인도 추가
    private static final List<String> COINS = List.of("BTCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT");

/*
    public String getCryptoPrice(String symbol) {
        try {
            BinancePriceResponse response = restTemplate.getForObject(BINANCE_API_URL + symbol, BinancePriceResponse.class);
            if (response != null) {
                cachedPrices.put(symbol, response.getPrice()); // Cache latest price
                return response.getPrice();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return cachedPrices.getOrDefault(symbol, "Unavailable"); // Return last known price if API fails
    }

    private static class BinancePriceResponse {
        private String price;
        public String getPrice() { return price; }
        public void setPrice(String price) { this.price = price; }
    }
*/
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

    private static class BinancePriceResponse {
        private String price;
        public String getPrice() { return price; }
        public void setPrice(String price) { this.price = price; }
    }
}