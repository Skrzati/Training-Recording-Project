package pl.MateuszJ.SavingWorkoutsApp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import pl.MateuszJ.SavingWorkoutsApp.model.User;
import pl.MateuszJ.SavingWorkoutsApp.repository.UserRepository;
import tools.jackson.core.TreeCodec;

import java.util.List;
import java.util.Optional;



@Service
public class UserService implements UserDetailsService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }
    public Optional<User> login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        User user = userOptional.get();
        String encodedPasswordFromDB = user.getPassword();
        if (userRepository.existsByUsername(username) == true) {
            System.out.printf("Użytkownik istnieje");
            if (passwordEncoder.matches(password,encodedPasswordFromDB)) {
                System.out.printf("Podane Hasło Się Zgadza");
            }

        }
        return null;
    }



    public User setUsers(@RequestBody User users) {
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        users.setRole(User.Role.USER);
        return userRepository.save(users);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Nie Znaleziono Użytkownika"));
    }
}
