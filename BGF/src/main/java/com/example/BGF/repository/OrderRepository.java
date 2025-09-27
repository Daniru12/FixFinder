package com.example.BGF.repository;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import com.example.BGF.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by customer
    List<Order> findByCustomer(User customer);
    
    // Find orders by customer ordered by order date descending
    List<Order> findByCustomerOrderByOrderDateDesc(User customer);
    
    // Find orders by product provider (service provider)
    List<Order> findByProductProvider(User provider);
    
    // Find orders by product provider ordered by order date descending
    List<Order> findByProductProviderOrderByOrderDateDesc(User provider);
    
    // Find orders by status
    List<Order> findByStatus(String status);
    
    // Find orders by status ordered by order date descending
    List<Order> findByStatusOrderByOrderDateDesc(String status);
    
    // Find orders by customer and status
    List<Order> findByCustomerAndStatus(User customer, String status);
    
    // Find orders by product provider and status
    List<Order> findByProductProviderAndStatus(User provider, String status);
    
    // Find orders by product
    List<Order> findByProduct(Product product);
    
    // Find orders by product ordered by order date descending
    List<Order> findByProductOrderByOrderDateDesc(Product product);
}
