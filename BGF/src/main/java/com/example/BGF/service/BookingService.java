package com.example.BGF.service;

import com.example.BGF.models.Booking;
import com.example.BGF.models.User;
import com.example.BGF.repository.BookingRepository;
import com.example.BGF.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING"); // default status
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (user.getRole()) {
            case "CUSTOMER":
                return bookingRepository.findByCustomerId(user.getId());
            case "PROVIDER":
                return bookingRepository.findByServiceUserId(user.getId());
            case "ADMIN":
                return bookingRepository.findAll();
            default:
                throw new RuntimeException("Unknown user role: " + user.getRole());
        }
    }


    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getBookingsByService(Long serviceId) {
        return bookingRepository.findByServiceId(serviceId);
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(existing -> {
            existing.setScheduledDate(updatedBooking.getScheduledDate());
            existing.setStatus(updatedBooking.getStatus());
            existing.setTotalPrice(updatedBooking.getTotalPrice());
            return bookingRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
