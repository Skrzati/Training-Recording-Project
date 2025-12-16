package pl.MateuszJ.SavingWorkoutsApp.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.MateuszJ.SavingWorkoutsApp.controller.AutenticationResponse;
import pl.MateuszJ.SavingWorkoutsApp.repository.UserRepository;
import pl.MateuszJ.SavingWorkoutsApp.model.User;
import pl.MateuszJ.SavingWorkoutsApp.model.User.Role;


import java.util.Optional;

@Slf4j
@Service
public class AutenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AutenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    private boolean isEmail(String identifier) {
        return identifier != null && identifier.contains("@");
    }
    public AutenticationResponse register(String firstName, String lastName, String username, String email, String password) {

        if (userRepository.findByEmailOrUsername(email, username).isPresent()) {
            throw new IllegalStateException("Użytkownik o podanym emailu lub nazwie użytkownika już istnieje.");
        }

        var user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AutenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AutenticationResponse autenticate(String identifier, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, password)
        );

        Optional<User> userOptional;

        if (isEmail(identifier)) {
            userOptional = userRepository.findByEmail(identifier);
        } else {
            userOptional = userRepository.findByUsername(identifier);
        }

        var user = userOptional.orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony po uwierzytelnieniu"));

        var jwtToken = jwtService.generateToken(user);
        return AutenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}