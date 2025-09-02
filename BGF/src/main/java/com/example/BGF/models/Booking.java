package com.example.BGF.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with User (customer who books the service)
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Relationship with Service
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private AppService service;

    // Booking details
    private LocalDateTime bookingDate; // when the booking was made
    private LocalDateTime scheduledDate; // when the service is scheduled

    private String status; // Example: PENDING, CONFIRMED, COMPLETED, CANCELED
    private Double totalPrice;

    // --- Getters and Setters ---
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

    public AppService getService() {
        return service;
    }

    public void setService(AppService service) {
        this.service = service;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
