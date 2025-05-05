package com.example.gestionlivrables.ProjectClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "Project",url = "http://localhost:8092/project")
public interface ProjectClient {
    @GetMapping("/project/{id}")
    ProjectDTO getProjectById(@PathVariable("id") Long id);

    @GetMapping("/project/name/{name}")
    ProjectDTO getProjectByName(@PathVariable("name") String name);
}
