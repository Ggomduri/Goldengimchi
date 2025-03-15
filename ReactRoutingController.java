package com.goldenkimchi.tradingbot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactRoutingController {

    @GetMapping("/{path:[^\\.]*}") // ✅ Handles any path that does NOT contain a dot (.)
    public String serveFrontend() {
        return "forward:/index.html"; // ✅ Serve React's index.html
    }
}
