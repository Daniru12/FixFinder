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
        System.out.println("=== GET MY ORDERS DEBUG ===");
        System.out.println("User: " + user.getUsername() + " (ID: " + user.getId() + ")");
        List<Order> orders = orderService.getOrdersByCustomer(user);
        System.out.println("Found " + orders.size() + " orders for user");
        for (Order order : orders) {
            System.out.println("Order ID: " + order.getId() + ", Status: " + order.getStatus() + ", Product: " + (order.getProduct() != null ? order.getProduct().getName() : "null"));
        }
        System.out.println("=========================");
        return ResponseEntity.ok(orders);
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

    // UPDATE - Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status, @AuthenticationPrincipal User user) {
        try {
            System.out.println("=== UPDATE ORDER STATUS DEBUG ===");
            System.out.println("Order ID: " + id);
            System.out.println("New Status: " + status);
            System.out.println("User: " + user.getUsername() + " (Role: " + user.getRole() + ")");
            
            Order existingOrder = orderService.getOrderById(id);
            System.out.println("Found Order: " + existingOrder);
            System.out.println("Current Status: " + existingOrder.getStatus());
            System.out.println("Customer ID: " + existingOrder.getCustomer().getId());
            System.out.println("User ID: " + user.getId());
            
            // Check if user is the customer, provider, or admin
            boolean isCustomer = existingOrder.getCustomer().getId().equals(user.getId());
            boolean isProvider = existingOrder.getProduct().getProvider().getId().equals(user.getId());
            boolean isAdmin = "ADMIN".equals(user.getRole());
            
            System.out.println("Is Customer: " + isCustomer);
            System.out.println("Is Provider: " + isProvider);
            System.out.println("Is Admin: " + isAdmin);
            
            // Allow customers to change order status to CANCELLED only
            if (isCustomer && "CANCELLED".equals(status)) {
                System.out.println("Customer cancelling order - ALLOWED");
                Order updatedOrder = orderService.updateOrderStatus(id, status);
                System.out.println("Order cancelled successfully: " + updatedOrder.getStatus());
                return ResponseEntity.ok(updatedOrder);
            }
            
            // Allow providers and admins to change any status
            if (isProvider || isAdmin) {
                System.out.println("Provider/Admin changing status - ALLOWED");
                Order updatedOrder = orderService.updateOrderStatus(id, status);
                System.out.println("Order updated successfully: " + updatedOrder.getStatus());
                return ResponseEntity.ok(updatedOrder);
            }
            
            System.out.println("Access DENIED - returning 400");
            return ResponseEntity.badRequest().body(Map.of("error", "Access denied. Customers can only cancel orders, providers can change shipping status."));
        } catch (RuntimeException e) {
            System.out.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Order not found or access denied: " + e.getMessage()));
        } catch (Exception e) {
            System.out.println("Unexpected Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Unexpected error: " + e.getMessage()));
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
