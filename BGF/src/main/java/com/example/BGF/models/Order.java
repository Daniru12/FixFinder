package com.example.BGF.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer; // The user who placed the order

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // The product being ordered

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double totalPrice; // quantity * product.price

    @Column(nullable = false)
    private Double deliveryFee = 300.0; // Default delivery fee for island-wide delivery

    private String paymentMethod = "COD"; // COD, CREDIT_CARD, etc.

    private String status = "PENDING"; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    private String deliveryAddress;

    private String notes;

    private LocalDateTime orderDate;

    private LocalDateTime updatedAt;

    // Constructors
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Order(User customer, Product product, Integer quantity, String deliveryAddress) {
        this();
        this.customer = customer;
        this.product = product;
        this.quantity = quantity;
        this.deliveryAddress = deliveryAddress;
        this.totalPrice = product.getPrice() * quantity;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper method to update timestamp
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper method to calculate total price
    public void calculateTotalPrice() {
        if (product != null && quantity != null) {
            this.totalPrice = (product.getPrice() * quantity) + deliveryFee;
        }
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", customer=" + (customer != null ? customer.getUsername() : "null") +
                ", product=" + (product != null ? product.getId() + ":" + product.getName() : "null") +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", deliveryFee=" + deliveryFee +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", status='" + status + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                ", notes='" + notes + '\'' +
                ", orderDate=" + orderDate +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
