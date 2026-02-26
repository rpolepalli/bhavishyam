package com.bhavishyam.user.service;

import com.bhavishyam.user.model.User;
import com.bhavishyam.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Mono<User> createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setBalance(BigDecimal.valueOf(1000)); // Initial balance
        
        return userRepository.save(user)
            .doOnSuccess(u -> kafkaTemplate.send("user-events", "USER_CREATED", u));
    }

    public Mono<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    public Mono<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Flux<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Mono<User> updateBalance(Long userId, BigDecimal amount) {
        return userRepository.findById(userId)
            .flatMap(user -> {
                user.setBalance(user.getBalance().add(amount));
                user.setUpdatedAt(LocalDateTime.now());
                return userRepository.save(user);
            })
            .doOnSuccess(u -> kafkaTemplate.send("user-events", "BALANCE_UPDATED", u));
    }
}
