package com.example.BGF.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;// Example: ADMIN, USER
    private String email;
    private String fullName;
    private String serviceType;
    private String address;
    private String phone;
    private boolean available = true;

    // --- Getters and Setters ---
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getServiceType() { return serviceType; }

    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getAddress() { return address; }

    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }

    public void setPhone(String phone) { this.phone = phone; }

    public boolean isAvailable() { return available; }

    public void setAvailable(boolean available) { this.available = available; }

}
