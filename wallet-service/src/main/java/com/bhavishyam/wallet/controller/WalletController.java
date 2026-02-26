package com.bhavishyam.wallet.controller;

import com.bhavishyam.wallet.model.Transaction;
import com.bhavishyam.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class WalletController {
    private final WalletService walletService;

    @PostMapping("/transactions")
    public Mono<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return walletService.createTransaction(transaction);
    }

    @GetMapping("/transactions/user/{userId}")
    public Flux<Transaction> getUserTransactions(@PathVariable Long userId) {
        return walletService.getUserTransactions(userId);
    }
}
