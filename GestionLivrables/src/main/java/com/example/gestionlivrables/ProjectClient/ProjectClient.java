package com.example.gestionlivrables.ProjectClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Project")
public interface ProjectClient {
    @GetMapping("/project/{id}")
    ProjectDTO getProjectById(@PathVariable("id") Long id);
}
