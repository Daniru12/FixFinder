package com.example.BGF.controller;

import com.example.BGF.models.Order;
import com.example.BGF.models.User;
import com.example.BGF.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // CREATE - Create a new order (only authenticated users)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order order, @AuthenticationPrincipal User user) {
        try {
            System.out.println("=== ORDER CONTROLLER DEBUG ===");
            System.out.println("Received order: " + order);
            System.out.println("User: " + user);
            System.out.println("Product ID: " + (order.getProduct() != null ? order.getProduct().getId() : "null"));
            System.out.println("Quantity: " + order.getQuantity());
            System.out.println("Delivery Fee: " + order.getDeliveryFee());
            System.out.println("Payment Method: " + order.getPaymentMethod());
            System.out.println("Delivery Address: " + order.getDeliveryAddress());
            System.out.println("Notes: " + order.getNotes());
            System.out.println("Status: " + order.getStatus());
            System.out.println("===============================");
            
            Order createdOrder = orderService.createOrder(order, user);
            return ResponseEntity.ok(createdOrder);
        } catch (RuntimeException e) {
            System.out.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error: " + e.getMessage()));
        } catch (Throwable t) {
            System.out.println("Throwable: " + t.getMessage());
            t.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Unexpected error: " + t.getMessage()));
        }
    }

    // READ - Get all orders (Admin only)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@AuthenticationPrincipal User user) {
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // READ - Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            Order order = orderService.getOrderById(id);
            
            // Check if user is the customer, provider, or admin
            if (!"ADMIN".equals(user.getRole()) && 
                !order.getCustomer().getId().equals(user.getId()) && 
                !order.getProduct().getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Get my orders (customer's own orders)
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(user));
    }

    // READ - Get orders for my products (provider's orders)
    @GetMapping("/provider-orders")
    public ResponseEntity<List<Order>> getProviderOrders(@AuthenticationPrincipal User user) {
        // Check if user is a service provider or admin
        if (!"ADMIN".equals(user.getRole()) && (user.getServiceType() == null || user.getServiceType().isEmpty())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getOrdersByProvider(user));
    }

    // READ - Get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status, @AuthenticationPrincipal User user) {
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    // READ - Get my orders by status
    @GetMapping("/my-orders/status/{status}")
    public ResponseEntity<List<Order>> getMyOrdersByStatus(@PathVariable String status, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerAndStatus(user, status));
    }

    // READ - Get provider orders by status
    @GetMapping("/provider-orders/status/{status}")
    public ResponseEntity<List<Order>> getProviderOrdersByStatus(@PathVariable String status, @AuthenticationPrincipal User user) {
        // Check if user is a service provider or admin
        if (!"ADMIN".equals(user.getRole()) && (user.getServiceType() == null || user.getServiceType().isEmpty())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getOrdersByProviderAndStatus(user, status));
    }

    // UPDATE - Update order
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails, @AuthenticationPrincipal User user) {
        try {
            Order existingOrder = orderService.getOrderById(id);
            
            // Check if user is the customer, provider, or admin
            if (!"ADMIN".equals(user.getRole()) && 
                !existingOrder.getCustomer().getId().equals(user.getId()) && 
                !existingOrder.getProduct().getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(orderService.updateOrder(id, orderDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE - Update order status (provider and admin only)
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status, @AuthenticationPrincipal User user) {
        try {
            Order existingOrder = orderService.getOrderById(id);
            
            // Check if user is the provider or admin
            if (!"ADMIN".equals(user.getRole()) && !existingOrder.getProduct().getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            Order existingOrder = orderService.getOrderById(id);
            
            // Check if user is the customer, provider, or admin
            if (!"ADMIN".equals(user.getRole()) && 
                !existingOrder.getCustomer().getId().equals(user.getId()) && 
                !existingOrder.getProduct().getProvider().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().build();
            }
            
            orderService.deleteOrder(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // CANCEL - Cancel order (customer only) - deletes from database
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            Order existingOrder = orderService.getOrderById(id);
            
            // Check if user is the customer or admin
            if (!"ADMIN".equals(user.getRole()) && !existingOrder.getCustomer().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Unauthorized to cancel this order"));
            }
            
            orderService.cancelOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order cancelled and deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
