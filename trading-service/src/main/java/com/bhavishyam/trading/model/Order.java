package com.bhavishyam.trading.model;

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
@Table("orders")
public class Order {
    @Id
    private Long id;
    private Long marketId;
    private Long userId;
    private String side; // YES, NO
    private String type; // BUY, SELL
    private Integer quantity;
    private BigDecimal price;
    private String status; // PENDING, FILLED, CANCELLED
    private LocalDateTime createdAt;
}
