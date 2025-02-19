package com.example.sprinproject.role;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role getOrCreateRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(name.toUpperCase()) // Store roles in uppercase for consistency
                            .build();
                    return roleRepository.save(newRole);
                });
    }

    public List<Role> getRoles(){
        return roleRepository.findAll();
    }


}
