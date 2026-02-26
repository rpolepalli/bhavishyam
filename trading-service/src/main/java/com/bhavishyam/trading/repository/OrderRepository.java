package com.bhavishyam.trading.repository;

import com.bhavishyam.trading.model.Order;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface OrderRepository extends ReactiveCrudRepository<Order, Long> {
    Flux<Order> findByUserId(Long userId);
    Flux<Order> findByMarketId(Long marketId);
    Flux<Order> findByMarketIdAndStatus(Long marketId, String status);
}
