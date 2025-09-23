package com.example.BGF.controller;

import com.example.BGF.models.AppService;
import com.example.BGF.models.User;
import com.example.BGF.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private  ServiceService serviceService;

    @PostMapping("/admin/add")
    public ResponseEntity<AppService> addService(@RequestBody AppService service, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(serviceService.addService(service, user));
    }

    @PostMapping("/provider/add")
    public ResponseEntity<AppService> addServiceByProvider(@RequestBody AppService service, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(serviceService.addService(service, user));
    }


    @GetMapping("/user/all")
    public ResponseEntity<List<AppService>> getAll() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }
    
    // Read (single)
    @GetMapping("/user/{id}")
    public ResponseEntity<AppService> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // Read (by user)
    @GetMapping("/user/my-services")
    public ResponseEntity<List<AppService>> getMyServices(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(serviceService.getServicesByUser(user));
    }

    // Update
    @PutMapping("/admin/{id}")
    public ResponseEntity<AppService> updateService(
            @PathVariable Long id,
            @RequestBody AppService service,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(serviceService.updateService(id, service, user));
    }

    // Delete
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id, @AuthenticationPrincipal User user) {
        serviceService.deleteService(id, user);
        return ResponseEntity.ok().build();
    }
}