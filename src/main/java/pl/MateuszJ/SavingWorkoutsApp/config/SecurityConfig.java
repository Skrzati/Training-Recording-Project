package pl.MateuszJ.SavingWorkoutsApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer; // WAŻNY IMPORT!
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration; // WAŻNY IMPORT!
import org.springframework.web.cors.CorsConfigurationSource; // WAŻNY IMPORT!
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // WAŻNY IMPORT!

import java.util.Arrays; // Dodaj ten import

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Użyjemy BCryptPasswordEncoder, tak jak wcześniej
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Nowa metoda do konfiguracji CORS (wymagana przez nowsze Spring Security)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 1. Dopuszczone źródła (Frontend React)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // 2. Dopuszczone metody HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 3. Dopuszczone nagłówki
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // 4. Pozwolenie na ciasteczka/autoryzację (dla przyszłego logowania)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Zastosuj tę konfigurację do wszystkich ścieżek
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Zastosowanie konfiguracji CORS
                .cors(Customizer.withDefaults()) // Użyj skonfigurowanego powyżej beana CorsConfigurationSource
                // 2. Wyłączenie CSRF
                .csrf(csrf -> csrf.disable())

                // 3. Reguły autoryzacji dla żądań
                .authorizeHttpRequests(authorize -> authorize
                        // Rejestracja (POST /users) i przyszłe logowanie (/auth/**) są publiczne
                        .requestMatchers(HttpMethod.POST, "/users").permitAll() // Tylko POST na /users jest dozwolony
                        .requestMatchers("/auth/**").permitAll()

                        // Użytkownicy mogą pobierać lub zapisywać treningi
                        .requestMatchers("/api/workouts/**").hasAnyRole("USER", "ADMIN")

                        // Administrator ma pełny dostęp do wszystkich pozostałych ścieżek
                        // Wymaga to pewnej ostrożności; lepiej definiować ścieżki admina jawnie
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Wymagaj uwierzytelnienia dla wszystkich pozostałych żądań
                        .anyRequest().authenticated()
                )

                // 4. Konfiguracja procesu logowania (Http Basic Auth)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}