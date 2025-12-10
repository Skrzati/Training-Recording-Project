package pl.MateuszJ.SavingWorkoutsApp.controller;

import ch.qos.logback.core.model.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.MateuszJ.SavingWorkoutsApp.model.User;
import pl.MateuszJ.SavingWorkoutsApp.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Optional<User> getUsers(@RequestBody User user) {
        return userService.login(user.getUsername(), user.getPassword());
    }

    @PostMapping("/register")
    public User addUser(@RequestBody User user) {
        return userService.setUsers(user);
    }
}
