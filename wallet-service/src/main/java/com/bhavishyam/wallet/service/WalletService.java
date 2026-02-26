package com.bhavishyam.wallet.service;

import com.bhavishyam.wallet.model.Transaction;
import com.bhavishyam.wallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final TransactionRepository transactionRepository;
    private final WebClient.Builder webClientBuilder;

    public Mono<Transaction> createTransaction(Transaction transaction) {
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setStatus("PENDING");
        
        return transactionRepository.save(transaction)
            .flatMap(this::processTransaction);
    }

    private Mono<Transaction> processTransaction(Transaction transaction) {
        return webClientBuilder.build()
            .post()
            .uri("http://user-service:8081/api/users/" + transaction.getUserId() + "/balance")
            .bodyValue(Map.of("amount", transaction.getAmount()))
            .retrieve()
            .bodyToMono(Void.class)
            .then(Mono.defer(() -> {
                transaction.setStatus("COMPLETED");
                return transactionRepository.save(transaction);
            }))
            .onErrorResume(e -> {
                transaction.setStatus("FAILED");
                return transactionRepository.save(transaction);
            });
    }

    public Flux<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    @KafkaListener(topics = "order-events", groupId = "wallet-service")
    public void handleOrderEvent(Map<String, Object> event) {
        String eventType = (String) event.get("type");
        if ("ORDER_MATCHED".equals(eventType)) {
            // Process payment for matched orders
            Map<String, Object> order = (Map<String, Object>) event.get("order");
            Long userId = ((Number) order.get("userId")).longValue();
            BigDecimal amount = new BigDecimal(order.get("price").toString());
            
            Transaction transaction = new Transaction();
            transaction.setUserId(userId);
            transaction.setType("TRADE_BUY");
            transaction.setAmount(amount.negate());
            transaction.setReference("ORDER_" + order.get("id"));
            
            createTransaction(transaction).subscribe();
        }
    }
}
