package com.example.BGF.controller;

import com.example.BGF.models.User;
import com.example.BGF.security.JwtUtil;
import com.example.BGF.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private  UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        return userService.findByUsername(user.getUsername())
                .map(found -> {
                    if (userService.validatePassword(user.getPassword(), found.getPassword())) {
                        String token = jwtUtil.generateToken(found.getUsername(), found.getRole());
                        Map<String, String> response = new HashMap<>();
                        response.put("token", token);
                        response.put("id", String.valueOf(found.getId()));
                        response.put("role", found.getRole());
                        response.put("username", found.getUsername());
                        response.put("email", found.getEmail());
                        response.put("phone", found.getPhone());
                        response.put("fullName", found.getFullName());
                        response.put("available", String.valueOf(found.isAvailable()));
                        response.put("address", found.getAddress());
                        response.put("serviceType", found.getServiceType());
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
                    }
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "User not found")));
    }


}