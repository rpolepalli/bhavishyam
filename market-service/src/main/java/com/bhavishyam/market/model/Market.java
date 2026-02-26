package com.bhavishyam.market.model;

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
@Table("markets")
public class Market {
    @Id
    private Long id;
    private String title;
    private String description;
    private String category;
    private LocalDateTime endDate;
    private String status; // ACTIVE, CLOSED, SETTLED
    private BigDecimal yesPrice;
    private BigDecimal noPrice;
    private BigDecimal volume;
    private Boolean outcome;
    private LocalDateTime createdAt;
}
