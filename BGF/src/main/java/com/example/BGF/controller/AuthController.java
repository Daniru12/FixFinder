package com.example.BGF.controller;

import com.example.BGF.models.User;
import com.example.BGF.security.JwtUtil;
import com.example.BGF.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<String> login(@RequestBody User user) {
        return userService.findByUsername(user.getUsername())
                .map(found -> {
                    if (userService.validatePassword(user.getPassword(), found.getPassword())) {
                        String token = jwtUtil.generateToken(found.getUsername(), found.getRole());
                        return ResponseEntity.ok(token);
                    } else {
                        return ResponseEntity.badRequest().body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }
}