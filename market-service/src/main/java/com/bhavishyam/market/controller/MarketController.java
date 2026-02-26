package com.bhavishyam.market.controller;

import com.bhavishyam.market.model.Market;
import com.bhavishyam.market.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class MarketController {
    private final MarketService marketService;

    @PostMapping
    public Mono<Market> createMarket(@RequestBody Market market) {
        return marketService.createMarket(market);
    }

    @GetMapping("/{id}")
    public Mono<Market> getMarket(@PathVariable Long id) {
        return marketService.getMarket(id);
    }

    @GetMapping
    public Flux<Market> getActiveMarkets() {
        return marketService.getActiveMarkets();
    }

    @GetMapping("/category/{category}")
    public Flux<Market> getMarketsByCategory(@PathVariable String category) {
        return marketService.getMarketsByCategory(category);
    }

    @PostMapping("/{id}/settle")
    public Mono<Market> settleMarket(@PathVariable Long id, @RequestParam Boolean outcome) {
        return marketService.settleMarket(id, outcome);
    }
}
