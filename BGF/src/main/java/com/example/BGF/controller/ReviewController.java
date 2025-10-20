package com.example.BGF.controller;

import com.example.BGF.models.Review;
import com.example.BGF.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Create Review
    @PostMapping("/add")
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.saveReview(review));
    }


    // Get All Reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Get Review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        return review != null ? ResponseEntity.ok(review) : ResponseEntity.notFound().build();
    }

    // Update Review
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review updatedReview = reviewService.updateReview(id, review);
        return updatedReview != null ? ResponseEntity.ok(updatedReview) : ResponseEntity.notFound().build();
    }

    // Delete Review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        return reviewService.deleteReviewByAdmin(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Get Reviews by Service
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getReviewsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    // Get Reviews by User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    // Get Average Rating for Service
    @GetMapping("/service/{serviceId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getAverageRating(serviceId));
    }


    // Get all reviews (for admin dashboard)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Review>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Approve review (admin only)
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<Review> approveReview(@PathVariable Long id) {
        Review approvedReview = reviewService.approveReview(id);
        return approvedReview != null ? ResponseEntity.ok(approvedReview) : ResponseEntity.notFound().build();
    }

    // Get only approved reviews for a service (for public display)
    @GetMapping("/service/{serviceId}/approved")
    public ResponseEntity<List<Review>> getApprovedReviews(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getApprovedReviewsByService(serviceId));
    }


    // Delete review (admin only)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteReviewByAdmin(@PathVariable Long id) {
        boolean deleted = reviewService.deleteReviewByAdmin(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }


}
