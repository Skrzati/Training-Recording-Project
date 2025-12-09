package pl.MateuszJ.SavingWorkoutsApp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import pl.MateuszJ.SavingWorkoutsApp.model.User;
import pl.MateuszJ.SavingWorkoutsApp.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private  UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public List<User> getUsers() {
    return userRepository.findAll();
    }
    public User setUsers(@RequestBody User users) {
        return userRepository.save(users);
    }

}
