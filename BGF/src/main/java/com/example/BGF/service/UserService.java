package com.example.BGF.service;

import com.example.BGF.models.User;
import com.example.BGF.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create
    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Read operations
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Update
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setUsername(userDetails.getUsername());
        
        // Only update password if it's provided and not already hashed
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            // Check if password is already hashed (BCrypt hashes start with $2a$ or $2b$)
            if (!userDetails.getPassword().startsWith("$2a$") && !userDetails.getPassword().startsWith("$2b$")) {
                user.setPassword(encoder.encode(userDetails.getPassword()));
            }
            // If password is already hashed, don't re-encrypt it
        }
        
        user.setEmail(userDetails.getEmail());
        user.setFullName(userDetails.getFullName());
        user.setRole(userDetails.getRole());
        user.setServiceType(userDetails.getServiceType());
        user.setAddress(userDetails.getAddress());
        user.setPhone(userDetails.getPhone());
        user.setAvailable(userDetails.isAvailable());
        
        return userRepository.save(user);
    }

    // Delete
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    // Update availability only
    public User updateAvailability(Long userId, boolean available) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setAvailable(available);
        return userRepository.save(user);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    // Update password only
    public User updatePassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setPassword(encoder.encode(newPassword));
        return userRepository.save(user);
    }
}
