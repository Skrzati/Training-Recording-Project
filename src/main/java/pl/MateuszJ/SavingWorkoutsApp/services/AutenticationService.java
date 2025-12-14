package pl.MateuszJ.SavingWorkoutsApp.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.MateuszJ.SavingWorkoutsApp.controller.AutenticationRequest;
import pl.MateuszJ.SavingWorkoutsApp.controller.AutenticationResponse;
import pl.MateuszJ.SavingWorkoutsApp.controller.RegisterRequest;
import pl.MateuszJ.SavingWorkoutsApp.repository.UserRepository;
import pl.MateuszJ.SavingWorkoutsApp.model.User;
import pl.MateuszJ.SavingWorkoutsApp.model.User.Role;

import java.util.Optional;

@Slf4j
@Service
public class AutenticationService {

    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public final AuthenticationManager authenticationManager;

    public AutenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Prosta metoda pomocnicza do logiki autentykacji
    private boolean isEmail(String identifier) {
        return identifier != null && identifier.contains("@");
    }


    public AutenticationResponse register(RegisterRequest request) {

        // --- WALIDACJA UNIKALNOŚCI PRZED ZAPISEM ---
        // Teraz używamy request.getUsername() jako drugiego argumentu
        if (userRepository.findByEmailOrUsername(request.getEmail(), request.getUsername()).isPresent()) {
            throw new IllegalStateException("Użytkownik o podanym emailu lub nazwie użytkownika już istnieje.");
        }
        // ---------------------------------------------

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername()) // UŻYWA NOWEGO POLA Z REQUESTA
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AutenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AutenticationResponse autenticate(AutenticationRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Wyszukanie użytkownika, aby pobrać obiekt User (identyfikator to email LUB username)
        String identifier = request.getEmail();
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