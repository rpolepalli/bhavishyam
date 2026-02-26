package com.bhavishyam.trading.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.util.Map;

@Slf4j
@Component
public class PriceUpdateWebSocketHandler implements WebSocketHandler {
    private final Sinks.Many<String> sink = Sinks.many().multicast().directBestEffort();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "price-updates", groupId = "websocket-group")
    public void handlePriceUpdate(Map<String, Object> update) {
        try {
            log.info("Kafka message received: {}", update);
            String message = objectMapper.writeValueAsString(Map.of(
                "type", "PRICE_UPDATE",
                "marketId", update.get("marketId"),
                "yesPrice", update.get("yesPrice"),
                "noPrice", update.get("noPrice"),
                "volume", update.getOrDefault("volume", 0),
                "timestamp", System.currentTimeMillis()
            ));
            Sinks.EmitResult result = sink.tryEmitNext(message);
            log.info("Sink emit result: {} for market {}", result, update.get("marketId"));
        } catch (Exception e) {
            log.error("Error processing price update: {}", e.getMessage(), e);
        }
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        log.info("WebSocket client connected: {}", session.getId());
        Flux<String> messages = sink.asFlux();

        return session.send(
            messages.map(session::textMessage)
        ).and(
            session.receive()
                .map(msg -> msg.getPayloadAsText())
                .doOnNext(this::handleClientMessage)
        );
    }

    private void handleClientMessage(String message) {
        log.info("Received from client: {}", message);
    }
}
