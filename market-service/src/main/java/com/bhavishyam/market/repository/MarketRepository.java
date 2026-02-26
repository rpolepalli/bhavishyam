package com.bhavishyam.market.repository;

import com.bhavishyam.market.model.Market;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface MarketRepository extends ReactiveCrudRepository<Market, Long> {
    Flux<Market> findByStatus(String status);
    Flux<Market> findByCategory(String category);
}
