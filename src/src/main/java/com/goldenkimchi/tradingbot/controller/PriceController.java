package com.goldenkimchi.tradingbot.controller;
import com.goldenkimchi.tradingbot.service.BinancePriceService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PriceController {

    private final BinancePriceService binancePriceService;

    public PriceController(BinancePriceService binancePriceService) {
        this.binancePriceService = binancePriceService;
    }

    @GetMapping("/prices")
    public Map<String, String> getCryptoPrices() {
        return binancePriceService.getCryptoPrices();
    }
}