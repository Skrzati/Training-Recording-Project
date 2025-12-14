package pl.MateuszJ.SavingWorkoutsApp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.MateuszJ.SavingWorkoutsApp.services.JwtService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // Upewniamy się, że zależności są wstrzyknięte (Dzięki @Component i konstruktorowi)
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail; // Używamy "userEmail" zamiast "username"

        // 1. Sprawdzenie, czy nagłówek autoryzacji istnieje i ma prefix "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Jeśli tokena nie ma, przekazujemy żądanie dalej w łańcuchu.
            // Spring Security obsłuży, czy ścieżka jest publiczna, czy wymaga autoryzacji.
            filterChain.doFilter(request, response);
            return; // Kończymy wykonanie tej metody
        }

        // 2. Ekstrakcja tokenu i nazwy użytkownika (emaila)
        jwt = authHeader.substring(7); // Token jest od 7. znaku ("Bearer ").
        userEmail = jwtService.extractUsername(jwt); // Zmienione na "userEmail" dla jasności.

        // 3. Weryfikacja: Jeśli email jest poprawny I użytkownik nie jest jeszcze uwierzytelniony
        // (SecurityContextHolder.getContext().getAuthentication() == null)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. Pobranie danych użytkownika z bazy danych
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Walidacja tokenu
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 6. Utworzenie obiektu uwierzytelnienia (uwierzytelnienie przebiegło pomyślnie)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, // Principal (dane użytkownika)
                        null, // Credentials (już nam niepotrzebne)
                        userDetails.getAuthorities() // Role użytkownika
                );

                // Dodanie szczegółów autentykacji (IP, sesja)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Umieszczenie obiektu uwierzytelnienia w SecurityContext
                // Od tego momentu Spring traktuje żądanie jako uwierzytelnione
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Przekazanie żądania do kolejnego filtra (lub do DispatcherServlet)
        filterChain.doFilter(request, response);
    }
}