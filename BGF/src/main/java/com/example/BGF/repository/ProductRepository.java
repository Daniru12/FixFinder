package com.example.BGF.repository;

import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by provider (service provider)
    List<Product> findByProvider(User provider);
    
    // Find products by category
    List<Product> findByCategory(String category);
    
    // Find products by status
    List<Product> findByStatus(String status);
    
    // Find active products only
    List<Product> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find products by provider and status
    List<Product> findByProviderAndStatus(User provider, String status);
}
