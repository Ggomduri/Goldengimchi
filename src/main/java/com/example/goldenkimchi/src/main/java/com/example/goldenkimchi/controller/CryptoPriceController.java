package com.example.goldenkimchi.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CryptoPriceController {

    private final BinancePriceService binancePriceService;

    public CryptoPriceController(BinancePriceService binancePriceService) {
        this.binancePriceService = binancePriceService;
    }

    @GetMapping("/prices")
    public Map<String, String> getCryptoPrices() {
        return binancePriceService.getCryptoPrices();
    }
}
