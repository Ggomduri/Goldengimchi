package com.goldenkimchi.tradingbot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
class SecurityConfig {
    /*
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (especially useful for APIs without forms)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/","/prices", "/index.html", "/api/**", "/static/**", "/css/**", "/js/**", "/images/**").permitAll() // Allow access to homepage and static resources
                            .anyRequest().permitAll() // Allow all other requests
                    );

            return http.build();
        }
    }
    */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/manifest.json",
                                "/logo192.png",
                                "/logo512.png",
                                "/favicon.ico",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/static/**",
                                "api/prices"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> {
                    oauth2.loginPage("/oauth2/authorization/google");
                })
                .logout(logout -> logout
                        .logoutSuccessUrl("/").permitAll()
                );
        return http.build();
    }
}
