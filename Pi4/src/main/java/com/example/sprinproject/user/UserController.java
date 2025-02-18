package com.example.sprinproject.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/{idUser}/assign-role")
    public ResponseEntity<String> assignRoleToUser(@PathVariable Long idUser, @RequestParam String roleName) {
        try {
            userService.assignRoleToUser(idUser, roleName);
            return ResponseEntity.ok("Role '" + roleName + "' assigned to user successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/getUserById/{idUser}")
    public User getProfile(@PathVariable Long idUser){
        return userService.getProfile(idUser);
    }

    @GetMapping("/all-except-me")
    public List<User> getAllUsersExceptMe(@RequestParam Long currentUserId) {
        return userService.getAllUsersExcept(currentUserId);
    }

    }
