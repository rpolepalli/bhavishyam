package com.bhavishyam.wallet.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("transactions")
public class Transaction {
    @Id
    private Long id;
    private Long userId;
    private String type; // DEPOSIT, WITHDRAWAL, TRADE_BUY, TRADE_SELL, SETTLEMENT
    private BigDecimal amount;
    private String status; // PENDING, COMPLETED, FAILED
    private String reference;
    private LocalDateTime createdAt;
}
