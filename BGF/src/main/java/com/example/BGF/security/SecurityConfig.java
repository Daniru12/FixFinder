package com.example.BGF.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/services/admin/**").hasRole("ADMIN")
                        .requestMatchers("/services/user/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/users/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/users/admin/**").hasRole("ADMIN")
                        .requestMatchers("/reviews/**").permitAll()
                        .requestMatchers("/products").permitAll()
                        .requestMatchers("/products/category/**").permitAll()
                        .requestMatchers("/products/search").permitAll()
                        .requestMatchers("/products/{id}").permitAll()
                        .requestMatchers("/products/create").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/products/my-products").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/products/{id}/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/products/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
