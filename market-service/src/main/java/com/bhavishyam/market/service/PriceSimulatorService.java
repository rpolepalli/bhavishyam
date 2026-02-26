package com.bhavishyam.market.service;

import com.bhavishyam.market.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceSimulatorService {
    private final MarketRepository marketRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Scheduled(fixedRate = 5000, initialDelay = 10000)
    public void simulatePriceMovements() {
        log.info("Price simulator tick...");
        marketRepository.findByStatus("ACTIVE")
            .doOnNext(market -> log.debug("Processing market: {}", market.getTitle()))
            .flatMap(market -> {
                double shift = ThreadLocalRandom.current().nextDouble(-2.0, 2.0);
                if (Math.abs(shift) < 0.3) return reactor.core.publisher.Mono.empty();

                BigDecimal currentYes = market.getYesPrice();
                BigDecimal newYes = currentYes.add(BigDecimal.valueOf(shift))
                    .setScale(2, RoundingMode.HALF_UP);

                if (newYes.compareTo(BigDecimal.ONE) < 0) newYes = BigDecimal.ONE;
                if (newYes.compareTo(BigDecimal.valueOf(99)) > 0) newYes = BigDecimal.valueOf(99);

                BigDecimal newNo = BigDecimal.valueOf(100).subtract(newYes)
                    .setScale(2, RoundingMode.HALF_UP);

                market.setYesPrice(newYes);
                market.setNoPrice(newNo);
                market.setVolume(market.getVolume().add(
                    BigDecimal.valueOf(ThreadLocalRandom.current().nextInt(5, 50))));

                return marketRepository.save(market);
            })
            .doOnNext(saved -> {
                Map<String, Object> update = Map.of(
                    "type", "PRICE_UPDATE",
                    "marketId", saved.getId(),
                    "yesPrice", saved.getYesPrice(),
                    "noPrice", saved.getNoPrice(),
                    "volume", saved.getVolume(),
                    "timestamp", System.currentTimeMillis()
                );
                kafkaTemplate.send("price-updates", "PRICE_UPDATED", update);
                log.info("Price update sent for market {}: YES={}, NO={}",
                    saved.getId(), saved.getYesPrice(), saved.getNoPrice());
            })
            .doOnError(err -> log.error("Price simulator error: {}", err.getMessage(), err))
            .onErrorResume(err -> reactor.core.publisher.Flux.empty())
            .subscribe();
    }
}
