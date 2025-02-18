package com.example.sprinproject.repository;

import com.example.sprinproject.Entity.Planning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository


public interface PlanningRepo extends JpaRepository<Planning, Long> {
}
