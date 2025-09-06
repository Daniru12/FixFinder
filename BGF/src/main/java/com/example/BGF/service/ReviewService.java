package com.example.BGF.service;

import com.example.BGF.models.Review;
import com.example.BGF.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Create
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    // Read all
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Read by ID
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    // Update
    public Review updateReview(Long id, Review updatedReview) {
        Review review = reviewRepository.findById(id).orElse(null);
        if (review != null) {
            review.setRating(updatedReview.getRating());
            review.setComment(updatedReview.getComment());
            return reviewRepository.save(review);
        }
        return null;
    }

    // Delete
    public boolean deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Find reviews by service
    public List<Review> getReviewsByService(Long serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }

    // Find reviews by user
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Get average rating of a service
    public double getAverageRating(Long serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }
}
