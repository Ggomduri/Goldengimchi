package com.example.goldenkimchi.controller;

import com.example.goldenkimchi.favoritecoinservice.domain.coin.Coin;
import com.example.goldenkimchi.reository.CoinRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@RequestMapping
@RequiredArgsConstructor
public class GoldenkimchiController {

    private final CoinRepository coinRepository;

/*
    @GetMapping("/")
    public String index(Model model) {
        return "index"; // 이런 home 페이지를 따로 Get Mapping해줘야됐었나? 김영한 샘플 확인해보자.
    }

*/

    @GetMapping("/myFavorite")
    public String Coins(Model model) {
        List<Coin> myFavorite = coinRepository.findAll();
        model.addAttribute("myFavorite", myFavorite);
        return "myFavorite"; // url ~/myFavorite에 Get Request가 오면 myFavorite.html을 호출
    }

/*
    @PostMapping("/")
    public String addFavorite(Coin coin) {//@ModelAttribute가 뭐였는지 복습하기
        coinRepository.save(coin);
        return "redirect:/";
    }
*/

    /**
     * 테스트용 데이터
     */

    @PostConstruct
    public void init() {
        coinRepository.save(new Coin("BTC", 100000));
        coinRepository.save(new Coin("ETH", 3000));
    }

}
