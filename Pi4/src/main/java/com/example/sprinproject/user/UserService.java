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

    public void assignAndReplaceRoleToUser(Long idUser, String roleName) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().clear();

        user.getRoles().add(role);
        userRepository.save(user);
    }


    public User getProfile(Long idUser){
        return userRepository.findById(idUser).orElse(null);
    }

    public List<User> getAllUsersExcept(Long currentUserId) {
        return userRepository.findAllExcept(currentUserId);
    }

    public void DeleteUser(Long idUser){
        userRepository.deleteById(idUser);
    }

    public User updateUser(Long idUser, User updatedUser) {
        return userRepository.findById(idUser).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setEmail(updatedUser.getEmail());
            user.setDateOfBirth(updatedUser.getDateOfBirth());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with ID: " + idUser));
    }

    public User updatePassword(Long idUser, User updatedUser) {
        return userRepository.findById(idUser).map(user -> {
            user.setPassword(updatedUser.getPassword());

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with ID: " + idUser));
    }

    public void banUser(Long idUser, boolean lockStatus) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Set accountLocked to the given lockStatus (true to lock, false to unlock)
        user.setAccountLocked(lockStatus);
        userRepository.save(user); // Save the updated user to the database
    }

}
