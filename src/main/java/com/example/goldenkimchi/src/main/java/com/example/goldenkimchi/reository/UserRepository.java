package com.example.goldenkimchi.reository;

import com.example.goldenkimchi.favoritecoinservice.domain.coin.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
