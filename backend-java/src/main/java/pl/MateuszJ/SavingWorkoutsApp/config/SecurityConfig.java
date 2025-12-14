package pl.MateuszJ.SavingWorkoutsApp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Poprawne użycie 'final' dla wstrzykiwanych zależności
    private final AuthenticationProvider authenticationProvider;
    private final UserDetailsService userDetailsService;

    // Wstrzykiwanie przez pole (może być tutaj, aby uniknąć cyklu z AuthenticationManager)
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    // Konstruktor do wstrzykiwania zależności
    public SecurityConfig(AuthenticationProvider authenticationProvider, UserDetailsService userDetailsService) {
        this.authenticationProvider = authenticationProvider;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // --- KLUCZOWA POPRAWKA A ---
        // Upewnij się, że to jest POPRAWNY PORT Twojego Reacta/Frontendu (3000, 5173, etc.)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Zastosowanie konfiguracji CORS
                .cors(Customizer.withDefaults())

                // 2. Wyłączenie CSRF
                .csrf(AbstractHttpConfigurer::disable) // Zastąpienie deprecjonowanej metody

                // 3. Konfiguracja zarządzania sesją - KLUCZOWA DLA JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Reguły autoryzacji dla żądań
                .authorizeHttpRequests(authorize -> authorize
                        // --- KLUCZOWA POPRAWKA B ---
                        // Zezwól na wszystkie endpointy w Twoim AutenticationController
                        .requestMatchers("/api.v1/auth/**").permitAll()

                        // Wymagaj uwierzytelnienia dla wszystkich pozostałych żądań
                        .anyRequest().authenticated()
                )

                // 5. Dodanie niestandardowych elementów uwierzytelniania JWT:
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}