package com.bhavishyam.wallet.repository;

import com.bhavishyam.wallet.model.Transaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface TransactionRepository extends ReactiveCrudRepository<Transaction, Long> {
    Flux<Transaction> findByUserId(Long userId);
}
