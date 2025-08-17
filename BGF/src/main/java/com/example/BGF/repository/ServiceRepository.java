package com.example.BGF.repository;

import com.example.BGF.models.AppService;
import com.example.BGF.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<AppService, Long> {
    List<AppService> findByUser(User user);
}
