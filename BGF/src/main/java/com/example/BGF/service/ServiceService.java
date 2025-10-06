package com.example.BGF.service;

import com.example.BGF.models.AppService;
import com.example.BGF.models.User;
import com.example.BGF.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public AppService addService(AppService service, User user) {
        if (service.getServiceName() == null || service.getServiceName().isBlank()) {
            throw new IllegalArgumentException("Service name cannot be null or empty");
        }
        if (user==null){
            throw new IllegalArgumentException("User cannot be null or empty");
        }
        service.setUser(user); // set the user
        return serviceRepository.save(service);
    }

    public List<AppService> getAllServices() {
        return serviceRepository.findAll();
    }

    // Read (single)
    public AppService getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with id: " + id));
    }

    // Update
    public AppService updateService(Long id, AppService updatedService, User user) {
        AppService existingService = getServiceById(id);

        if (!existingService.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You don't have permission to update this service");
        }

        // Update all fields
        if (updatedService.getServiceName() != null && !updatedService.getServiceName().isBlank()) {
            existingService.setServiceName(updatedService.getServiceName());
        }
        if (updatedService.getDescription() != null) {
            existingService.setDescription(updatedService.getDescription());
        }
        if (updatedService.getPrice() != null) {
            existingService.setPrice(updatedService.getPrice());
        }
        if (updatedService.getImages() != null) {
            existingService.setImages(updatedService.getImages());
        }
        if (updatedService.getCategory() != null) {
            existingService.setCategory(updatedService.getCategory());
        }
        if (updatedService.getStatus() != null) {
            existingService.setStatus(updatedService.getStatus());
        }

        return serviceRepository.save(existingService);
    }

    // Delete
    public void deleteService(Long id, User user) {
        AppService service = getServiceById(id);

        if (!service.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You don't have permission to delete this service");
        }

        serviceRepository.deleteById(id);
    }

    // Get services by user
    public List<AppService> getServicesByUser(User user) {
        return serviceRepository.findByUser(user);
    }
}