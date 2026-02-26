package com.bhavishyam.trading.service;

import com.bhavishyam.trading.model.Order;
import com.bhavishyam.trading.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TradingService {
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Mono<Order> placeOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("PENDING");
        
        return orderRepository.save(order)
            .flatMap(this::matchOrder)
            .doOnSuccess(o -> kafkaTemplate.send("order-events", "ORDER_PLACED", o));
    }

    private Mono<Order> matchOrder(Order order) {
        // Simple matching logic - find opposite orders
        return orderRepository.findByMarketIdAndStatus(order.getMarketId(), "PENDING")
            .filter(o -> isMatchingOrder(order, o))
            .next()
            .flatMap(matchedOrder -> executeMatch(order, matchedOrder))
            .defaultIfEmpty(order);
    }

    private boolean isMatchingOrder(Order order1, Order order2) {
        return !order1.getId().equals(order2.getId()) &&
               !order1.getSide().equals(order2.getSide()) &&
               !order1.getType().equals(order2.getType()) &&
               order1.getPrice().compareTo(order2.getPrice()) >= 0;
    }

    private Mono<Order> executeMatch(Order order1, Order order2) {
        order1.setStatus("FILLED");
        order2.setStatus("FILLED");
        
        return orderRepository.save(order1)
            .then(orderRepository.save(order2))
            .doOnSuccess(o -> {
                kafkaTemplate.send("order-events", "ORDER_MATCHED", order1);
                kafkaTemplate.send("price-updates", "PRICE_UPDATED", order1);
            })
            .thenReturn(order1);
    }

    public Flux<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Flux<Order> getMarketOrders(Long marketId) {
        return orderRepository.findByMarketId(marketId);
    }

    public Mono<Order> cancelOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .flatMap(order -> {
                order.setStatus("CANCELLED");
                return orderRepository.save(order);
            })
            .doOnSuccess(o -> kafkaTemplate.send("order-events", "ORDER_CANCELLED", o));
    }
}
