package com.example.goldenkimchi.controller;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class BinancePriceService {

    private static final String BINANCE_API_URL = "https://api.binance.com/api/v3/ticker/price?symbol=";
    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> cachedPrices = new HashMap<>();

    private static final List<String> COINS = List.of("BTCUSDT", "ETHUSDT", "SOLUSDT", "DOGEUSDT");

    public Map<String, String> getCryptoPrices() {
        Map<String, String> prices = new HashMap<>();
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
