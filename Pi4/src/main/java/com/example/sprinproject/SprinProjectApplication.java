package com.example.sprinproject;

import com.example.sprinproject.role.Role;
import com.example.sprinproject.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableDiscoveryClient
public class SprinProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SprinProjectApplication.class, args);


    }
    @Bean
    public CommandLineRunner runner(RoleRepository rolerepo){
        return args -> {
            if (rolerepo.findByName("USER").isEmpty()){
                rolerepo.save(Role.builder().name("USER").build());
            } if (rolerepo.findByName("CHEF").isEmpty()) {
                rolerepo.save(Role.builder().name("CHEF").build());

            }
            if (rolerepo.findByName("ADMIN").isEmpty()){
                rolerepo.save(Role.builder().name("ADMIN").build());
            }
        };
    }


}
