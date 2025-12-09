package pl.MateuszJ.SavingWorkoutsApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Wyłącz CSRF, ponieważ używamy API (zakładając JWT)
                .csrf(csrf -> csrf.disable())

                // 2. Reguły autoryzacji dla żądań
                .authorizeHttpRequests(authorize -> authorize
                        // Rejestracja i logowanie są dostępne dla wszystkich
                        // (Załóżmy, że będą w ścieżce /auth/**)
                        .requestMatchers("/auth/**", "/users").permitAll()

                        // Użytkownicy mogą tylko POBRAĆ (GET) lub ZAPISAĆ (POST) SWOJE treningi
                        // (Załóżmy, że treningi mają endpoint /api/workouts)
                        // W tym miejscu NIE DA się sprawdzić WŁAŚCICIELA, ale możemy ograniczyć uprawnienia
                        .requestMatchers(HttpMethod.GET, "/api/workouts/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/workouts").hasAnyRole("USER", "ADMIN")

                        // Administrator ma pełny dostęp do zarządzania WSZYSTKIMI użytkownikami (np. /users)
                        .requestMatchers("/users/**").hasRole("ADMIN")

                        // Administrator ma pełny dostęp do wszystkich pozostałych ścieżek
                        .requestMatchers("/**").hasRole("ADMIN")

                        // Wymagaj uwierzytelnienia dla wszystkich pozostałych
                        .anyRequest().authenticated()
                )
                // 3. Konfiguracja procesu logowania (możesz użyć httpBasic lub customowego formularza/JWT)
                .httpBasic(httpBasic -> {}) // Domyślna konfiguracja Basic Auth dla uproszczenia
        ;

        return http.build();
    }
}
