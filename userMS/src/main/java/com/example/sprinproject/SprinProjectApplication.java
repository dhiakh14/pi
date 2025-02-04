package com.example.sprinproject;

import com.example.sprinproject.role.Role;
import com.example.sprinproject.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class SprinProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SprinProjectApplication.class, args);


    }
    @Bean
    public CommandLineRunner runner(RoleRepository rolerepo){
        return args -> {
            if (rolerepo.findByName("USER").isEmpty()){
                rolerepo.save(Role.builder().name("USER").build());
            }
        };
    }


}
