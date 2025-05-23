package com.example.sprinproject.repository;

import com.example.sprinproject.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface TaskRepo extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

}
