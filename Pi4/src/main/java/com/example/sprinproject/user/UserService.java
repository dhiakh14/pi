package com.example.sprinproject.user;

import com.example.sprinproject.role.Role;
import com.example.sprinproject.role.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final userRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(userRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public void assignRoleToUser(Long idUser, String roleName) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User already has this role!");
        }
    }

    public User getProfile(Long idUser){
        return userRepository.findById(idUser).orElse(null);
    }

    public List<User> getAllUsersExcept(Long currentUserId) {
        return userRepository.findAllExcept(currentUserId);
    }
}
