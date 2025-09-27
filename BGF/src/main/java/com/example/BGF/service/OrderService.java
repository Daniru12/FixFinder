package com.example.BGF.service;

import com.example.BGF.models.Order;
import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.repository.OrderRepository;
import com.example.BGF.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // CREATE - Create a new order
    public Order createOrder(Order order, User customer) {
        // Set the customer
        order.setCustomer(customer);
        
        // Calculate total price
        order.calculateTotalPrice();
        
        // Check if product has enough stock
        Product product = order.getProduct();
        if (product.getStockQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }
        
        // Set timestamps
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Save the order
        Order savedOrder = orderRepository.save(order);
        
        // Update product stock
        updateProductStock(product, order.getQuantity());
        
        return savedOrder;
    }

    // READ - Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // READ - Get order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    // READ - Get orders by customer
    public List<Order> getOrdersByCustomer(User customer) {
        return orderRepository.findByCustomerOrderByOrderDateDesc(customer);
    }

    // READ - Get orders by product provider
    public List<Order> getOrdersByProvider(User provider) {
        return orderRepository.findByProductProviderOrderByOrderDateDesc(provider);
    }

    // READ - Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByOrderDateDesc(status);
    }

    // READ - Get orders by customer and status
    public List<Order> getOrdersByCustomerAndStatus(User customer, String status) {
        return orderRepository.findByCustomerAndStatus(customer, status);
    }

    // READ - Get orders by provider and status
    public List<Order> getOrdersByProviderAndStatus(User provider, String status) {
        return orderRepository.findByProductProviderAndStatus(provider, status);
    }

    // UPDATE - Update order
    public Order updateOrder(Long id, Order orderDetails) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // Update fields
        order.setQuantity(orderDetails.getQuantity());
        order.setStatus(orderDetails.getStatus());
        order.setDeliveryAddress(orderDetails.getDeliveryAddress());
        order.setNotes(orderDetails.getNotes());
        order.setUpdatedAt(java.time.LocalDateTime.now());

        // Recalculate total price if quantity changed
        if (!order.getQuantity().equals(orderDetails.getQuantity())) {
            order.calculateTotalPrice();
        }

        return orderRepository.save(order);
    }

    // UPDATE - Update order status
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        order.setStatus(status);
        order.setUpdatedAt(java.time.LocalDateTime.now());

        return orderRepository.save(order);
    }

    // DELETE - Delete order
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // If order is not cancelled, restore product stock
        if (!"CANCELLED".equals(order.getStatus())) {
            restoreProductStock(order.getProduct(), order.getQuantity());
        }

        orderRepository.delete(order);
    }

    // CANCEL - Cancel order
    public Order cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }

        // Restore product stock
        restoreProductStock(order.getProduct(), order.getQuantity());

        // Update order status
        order.setStatus("CANCELLED");
        order.setUpdatedAt(java.time.LocalDateTime.now());

        return orderRepository.save(order);
    }

    // Helper method to update product stock (reduce)
    private void updateProductStock(Product product, Integer quantity) {
        int newStock = product.getStockQuantity() - quantity;
        product.setStockQuantity(newStock);
        
        // Update product status if out of stock
        if (newStock <= 0) {
            product.setStatus("OUT_OF_STOCK");
        }
        
        productRepository.save(product);
    }

    // Helper method to restore product stock (increase)
    private void restoreProductStock(Product product, Integer quantity) {
        int newStock = product.getStockQuantity() + quantity;
        product.setStockQuantity(newStock);
        
        // Update product status if back in stock
        if ("OUT_OF_STOCK".equals(product.getStatus()) && newStock > 0) {
            product.setStatus("ACTIVE");
        }
        
        productRepository.save(product);
    }
}
