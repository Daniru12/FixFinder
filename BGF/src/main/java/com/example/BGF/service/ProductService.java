package com.example.BGF.service;

import com.example.BGF.models.Product;
import com.example.BGF.models.User;
import com.example.BGF.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Create product (Admin and Service Provider can create)
    public Product createProduct(Product product, User provider) {
        product.setProvider(provider);
        product.setCreatedAt(java.time.LocalDateTime.now());
        product.setUpdatedAt(java.time.LocalDateTime.now());
        return productRepository.save(product);
    }

    // Read all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Read all active products
    public List<Product> getAllActiveProducts() {
        return productRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    // Read product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // Read products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // Read products by provider
    public List<Product> getProductsByProvider(User provider) {
        return productRepository.findByProvider(provider);
    }

    // Read active products by provider
    public List<Product> getActiveProductsByProvider(User provider) {
        return productRepository.findByProviderAndStatus(provider, "ACTIVE");
    }

    // Update product
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setStatus(productDetails.getStatus());
        product.setUpdatedAt(java.time.LocalDateTime.now());

        return productRepository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    // Update stock quantity
    public Product updateStock(Long id, Integer newStock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setStockQuantity(newStock);
        product.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Auto-update status based on stock
        if (newStock <= 0) {
            product.setStatus("OUT_OF_STOCK");
        } else if ("OUT_OF_STOCK".equals(product.getStatus())) {
            product.setStatus("ACTIVE");
        }
        
        return productRepository.save(product);
    }

    // Search products by name
    public List<Product> searchProductsByName(String name) {
        return productRepository.findAll().stream()
                .filter(product -> product.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }
}
