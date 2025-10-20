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
        
        // If product is not fully loaded (only has ID), fetch it from database
        Product product = order.getProduct();
        if (product != null && product.getId() != null && product.getName() == null) {
            final Long productId = product.getId();
            product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
            order.setProduct(product);
        }
        
        // Validate product exists
        if (product == null) {
            throw new RuntimeException("Product is required for order");
        }
        
        // Ensure delivery fee is set
        if (order.getDeliveryFee() == null) {
            order.setDeliveryFee(300.0);
        }
        
        // Ensure payment method is set
        if (order.getPaymentMethod() == null) {
            order.setPaymentMethod("COD");
        }
        
        // Calculate total price
        order.calculateTotalPrice();
        
        // Check if product has enough stock (only if stock tracking is enabled)
        // For products with stockQuantity = 0, we assume unlimited stock (COD scenario)
        if (product.getStockQuantity() > 0 && product.getStockQuantity() < order.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }
        
        // Set timestamps
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Save the order
        Order savedOrder = orderRepository.save(order);
        
        // Update product stock (only if stock tracking is enabled)
        if (product.getStockQuantity() > 0) {
            updateProductStock(product, order.getQuantity());
        }
        
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

        String previousStatus = order.getStatus();
        order.setStatus(status);
        order.setUpdatedAt(java.time.LocalDateTime.now());

        // Handle stock management based on status changes
        if ("CANCELLED".equals(previousStatus) && "PENDING".equals(status)) {
            // Order is being reactivated - reduce product stock
            System.out.println("Order reactivated from CANCELLED to PENDING - reducing product stock");
            updateProductStock(order.getProduct(), order.getQuantity());
        } else if ("PENDING".equals(previousStatus) && "CANCELLED".equals(status)) {
            // Order is being cancelled - restore product stock
            System.out.println("Order cancelled from PENDING to CANCELLED - restoring product stock");
            restoreProductStock(order.getProduct(), order.getQuantity());
        } else if ("CONFIRMED".equals(previousStatus) && "CANCELLED".equals(status)) {
            // Order is being cancelled from CONFIRMED - restore product stock
            System.out.println("Order cancelled from CONFIRMED to CANCELLED - restoring product stock");
            restoreProductStock(order.getProduct(), order.getQuantity());
        } else if ("SHIPPED".equals(previousStatus) && "CANCELLED".equals(status)) {
            // Order is being cancelled from SHIPPED - restore product stock
            System.out.println("Order cancelled from SHIPPED to CANCELLED - restoring product stock");
            restoreProductStock(order.getProduct(), order.getQuantity());
        }

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

    // CANCEL - Cancel order (deletes from database)
    public void cancelOrder(Long id) {
        System.out.println("=== CANCEL ORDER DEBUG ===");
        System.out.println("Attempting to cancel order ID: " + id);
        
        // Check if order exists before deletion
        boolean orderExistsBefore = orderRepository.existsById(id);
        System.out.println("Order exists before deletion: " + orderExistsBefore);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        System.out.println("Found order: " + order);
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Customer: " + (order.getCustomer() != null ? order.getCustomer().getUsername() : "null"));
        System.out.println("Product: " + (order.getProduct() != null ? order.getProduct().getName() : "null"));

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel a delivered order");
        }

        // Restore product stock (only if stock was being tracked)
        System.out.println("Restoring product stock...");
        restoreProductStock(order.getProduct(), order.getQuantity());

        // Delete the order from database
        System.out.println("Deleting order from database...");
        try {
            // Use custom native query delete method to bypass foreign key constraints
            System.out.println("Attempting native query deletion...");
            orderRepository.deleteOrderById(id);
            System.out.println("Order deleted successfully using native query!");
            
            // Verify deletion by trying to find the order
            try {
                boolean orderExistsAfter = orderRepository.existsById(id);
                System.out.println("Order exists after deletion: " + orderExistsAfter);
                
                if (!orderExistsAfter) {
                    System.out.println("✅ VERIFICATION: Order successfully deleted from database!");
                } else {
                    System.out.println("❌ VERIFICATION: Order still exists in database!");
                }
            } catch (Exception verifyException) {
                System.out.println("Verification check failed: " + verifyException.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("Error deleting order with native query: " + e.getMessage());
            e.printStackTrace();
            try {
                // Fallback: try deleting by ID
                System.out.println("Attempting deleteById fallback...");
                orderRepository.deleteById(id);
                System.out.println("Order deleted successfully by ID!");
            } catch (Exception e2) {
                System.out.println("Error deleting order by ID: " + e2.getMessage());
                e2.printStackTrace();
                try {
                    // Final fallback: try deleting the entity directly
                    System.out.println("Attempting delete(entity) fallback...");
                    orderRepository.delete(order);
                    System.out.println("Order deleted successfully by entity!");
                } catch (Exception e3) {
                    System.out.println("Error deleting order by entity: " + e3.getMessage());
                    e3.printStackTrace();
                    throw new RuntimeException("Failed to delete order: " + e3.getMessage());
                }
            }
        }
        System.out.println("=========================");
    }

    // Helper method to update product stock (reduce)
    private void updateProductStock(Product product, Integer quantity) {
        // Only update stock if it's being tracked (stockQuantity > 0)
        if (product.getStockQuantity() > 0) {
            int newStock = product.getStockQuantity() - quantity;
            product.setStockQuantity(newStock);
            
            // Update product status if out of stock
            if (newStock <= 0) {
                product.setStatus("OUT_OF_STOCK");
            }
            
            productRepository.save(product);
        }
    }

    // Helper method to restore product stock (increase)
    private void restoreProductStock(Product product, Integer quantity) {
        // Only restore stock if it was being tracked (stockQuantity > 0)
        if (product.getStockQuantity() > 0) {
            int newStock = product.getStockQuantity() + quantity;
            product.setStockQuantity(newStock);
            
            // Update product status if back in stock
            if ("OUT_OF_STOCK".equals(product.getStatus()) && newStock > 0) {
                product.setStatus("ACTIVE");
            }
            
            productRepository.save(product);
        }
    }
}
