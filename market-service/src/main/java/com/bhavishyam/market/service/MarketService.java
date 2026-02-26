package com.bhavishyam.market.service;

import com.bhavishyam.market.model.Market;
import com.bhavishyam.market.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MarketService {
    private final MarketRepository marketRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Mono<Market> createMarket(Market market) {
        market.setCreatedAt(LocalDateTime.now());
        market.setStatus("ACTIVE");
        market.setYesPrice(BigDecimal.valueOf(50));
        market.setNoPrice(BigDecimal.valueOf(50));
        market.setVolume(BigDecimal.ZERO);
        
        return marketRepository.save(market)
            .doOnSuccess(m -> kafkaTemplate.send("market-events", "MARKET_CREATED", m));
    }

    public Mono<Market> getMarket(Long id) {
        return marketRepository.findById(id);
    }

    public Flux<Market> getActiveMarkets() {
        return marketRepository.findByStatus("ACTIVE");
    }

    public Flux<Market> getMarketsByCategory(String category) {
        return marketRepository.findByCategory(category);
    }

    public Mono<Market> updatePrices(Long marketId, BigDecimal yesPrice, BigDecimal noPrice) {
        return marketRepository.findById(marketId)
            .flatMap(market -> {
                market.setYesPrice(yesPrice);
                market.setNoPrice(noPrice);
                return marketRepository.save(market);
            })
            .doOnSuccess(m -> kafkaTemplate.send("price-updates", "PRICE_UPDATED", m));
    }

    public Mono<Market> settleMarket(Long marketId, Boolean outcome) {
        return marketRepository.findById(marketId)
            .flatMap(market -> {
                market.setStatus("SETTLED");
                market.setOutcome(outcome);
                return marketRepository.save(market);
            })
            .doOnSuccess(m -> kafkaTemplate.send("market-events", "MARKET_SETTLED", m));
    }
}
