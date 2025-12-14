package pl.MateuszJ.SavingWorkoutsApp.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.MateuszJ.SavingWorkoutsApp.repository.UserRepository;

@Configuration
public class ApplicationConfig {

    // Wstrzyknięcie repozytorium do znalezienia użytkownika
    private final UserRepository userRepository;

    public ApplicationConfig(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. BEAN UserDetailsService: Wyszukuje użytkownika po nazwie
    // Zapewnia, że Spring znajdzie Twoją implementację
    @Bean
    public AuthenticationProvider authenticationProvider() {

        // 1. Zmiana: Przekazanie UserDetailsService do konstruktora.
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());

        // 2. Metoda setPasswordEncoder() JEST NADAL DOSTĘPNA i pozwala ustawić PasswordEncoder.
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // 1. Sprawdź, czy przekazany identyfikator jest emailem
            if (username.contains("@")) {
                return userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Użytkownik z emailem " + username + " nie znaleziony"));
            }

            // 2. Jeśli nie jest emailem, szukaj po nazwie użytkownika
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Użytkownik z nazwą " + username + " nie znaleziony"));
        };
    }

    // 3. BEAN PasswordEncoder: Służy do hashowania i weryfikacji haseł
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 4. BEAN AuthenticationManager: Konieczny do wstrzykiwania do kontrolerów (np. AutenticationController)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}