package com.example.BGF.repository;

import com.example.BGF.models.Booking;
import com.example.BGF.models.User;
import com.example.BGF.models.AppService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // All bookings for a specific customer
    List<Booking> findByCustomerId(Long customerId);

    // All bookings for a specific service
    List<Booking> findByServiceId(Long serviceId);

    // All bookings for a specific provider (based on the service's user/provider)
    List<Booking> findByServiceUserId(Long providerId);

    // Optional: filter by customer and status
    List<Booking> findByCustomerIdAndStatus(Long customerId, String status);

    // Optional: filter by service and status
    List<Booking> findByServiceIdAndStatus(Long serviceId, String status);

    // Optional: filter by provider and status
    List<Booking> findByServiceUserIdAndStatus(Long providerId, String status);
}
