package com.example.BGF.controller;

import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // CREATE Only Admin and Service Providers can create products
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody Product product, @AuthenticationPrincipal User user) {
        // Check if user is ADMIN or has a service type (service provider)
        if (!"ADMIN".equals(user.getRole()) && (user.getServiceType() == null || user.getServiceType().isEmpty())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(productService.createProduct(product, user));
    }

    // READ All users can read products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProductsIncludingInactive() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchProductsByName(name));
    }

    // Provider's own products
    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productService.getActiveProductsByProvider(user));
    }

    // UPDATE All authenticated users can update products
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product, @AuthenticationPrincipal User user) {
        try {
            // Check if user is the product owner or admin
            Product existingProduct = productService.getProductById(id);
            if (!"ADMIN".equals(user.getRole()) && !existingProduct.getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update stock quantity
    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam Integer stock, @AuthenticationPrincipal User user) {
        try {
            // Check if user is the product owner or admin
            Product existingProduct = productService.getProductById(id);
            if (!"ADMIN".equals(user.getRole()) && !existingProduct.getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(productService.updateStock(id, stock));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE All authenticated users can delete products
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            // Check if user is the product owner or admin
            Product existingProduct = productService.getProductById(id);
            if (!"ADMIN".equals(user.getRole()) && !existingProduct.getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<Product>> getAllProductsForAdmin(@AuthenticationPrincipal User user) {
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/admin/provider/{providerId}")
    public ResponseEntity<List<Product>> getProductsByProviderForAdmin(@PathVariable Long providerId, @AuthenticationPrincipal User user) {
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        // You would need to create a method to get user by ID in UserService
        // For now, returning empty list
        return ResponseEntity.ok(List.of());
    }
}
