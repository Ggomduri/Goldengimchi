package com.example.goldenkimchi.controller;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/prices", "/css/**", "/js/**").permitAll() // Allow public access
                        .requestMatchers("/api/favorites/**").authenticated() // Require login for favorites
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("/", true) // Redirect to home after login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );
        return http.build();
    }
}