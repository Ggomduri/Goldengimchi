package com.goldenkimchi.tradingbot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/info")
    public String getInfo() {
        return "Welcome to Golden Kimchi - Your Bitcoin Investment Partner!";
    }
}
