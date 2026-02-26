package com.bhavishyam.trading.controller;

import com.bhavishyam.trading.model.Order;
import com.bhavishyam.trading.service.TradingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/trading")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TradingController {
    private final TradingService tradingService;

    @PostMapping("/orders")
    public Mono<Order> placeOrder(@RequestBody Order order) {
        return tradingService.placeOrder(order);
    }

    @GetMapping("/orders/user/{userId}")
    public Flux<Order> getUserOrders(@PathVariable Long userId) {
        return tradingService.getUserOrders(userId);
    }

    @GetMapping("/orders/market/{marketId}")
    public Flux<Order> getMarketOrders(@PathVariable Long marketId) {
        return tradingService.getMarketOrders(marketId);
    }

    @DeleteMapping("/orders/{orderId}")
    public Mono<Order> cancelOrder(@PathVariable Long orderId) {
        return tradingService.cancelOrder(orderId);
    }
}
