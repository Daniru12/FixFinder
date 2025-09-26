package com.example.BGF.controller;

import com.example.BGF.models.Booking;
import com.example.BGF.models.User;
import com.example.BGF.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Create booking
    @PostMapping("/add")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();  // cast principal back to your User entity
        List<Booking> bookings = bookingService.getBookingsForUser(user.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider")
    public ResponseEntity<List<Booking>> getBookingsForProvider(Authentication authentication) {
        String username = ((com.example.BGF.models.User) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(bookingService.getBookingsForProvider(username));
    }

    @PreAuthorize("hasAuthority('PROVIDER')")
    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<Booking> confirmBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> requestBody) {

        String status = requestBody.get("status"); // get status from body
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Booking booking = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(booking);
    }





    @DeleteMapping("/api/bookings/{bookingId}")
    public ResponseEntity<String> removeBooking(@PathVariable Long bookingId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        bookingService.removeBooking(bookingId, user);
        return ResponseEntity.ok("Booking removed successfully");
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get bookings by customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomer(customerId));
    }

    // Get bookings by service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Booking>> getBookingsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(bookingService.getBookingsByService(serviceId));
    }

    // Update booking
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking));
    }

    // Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
