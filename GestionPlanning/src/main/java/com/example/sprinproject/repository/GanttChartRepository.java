package com.example.sprinproject.repository;

import com.example.sprinproject.Entity.GanttChart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GanttChartRepository extends JpaRepository<GanttChart, Long> {

        @Query("SELECT DISTINCT g FROM GanttChart g LEFT JOIN FETCH g.tasks")
        List<GanttChart> findAllWithTasks();
}