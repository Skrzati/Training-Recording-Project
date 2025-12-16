package pl.MateuszJ.SavingWorkoutsApp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*; // Dodano RestController i RequestMapping
import pl.MateuszJ.SavingWorkoutsApp.services.AutenticationService;

import java.util.Map; // Dodano import Map

@RestController
@RequestMapping("/api.v1/auth")
public class AutenticationController {

    private final AutenticationService service;

    public AutenticationController(AutenticationService service) {
        this.service = service;
    }

    // WAŻNE: Dodaj adnotację CORS, aby umożliwić front-endowi komunikację
    // z localhost:3000 lub innym portem.
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<AutenticationResponse> register(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(service.register(
                    body.get("firstName"),
                    body.get("lastName"),
                    body.get("username"),
                    body.get("email"),
                    body.get("password")
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(AutenticationResponse.builder().token(e.getMessage()).build());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/autenticate")
    public ResponseEntity<AutenticationResponse> authenticate(@RequestBody Map<String, String> body) {
        try {
            // Frontend wysyła { email: "...", password: "..." }.
            // Pole 'email' jest używane jako uniwersalny 'identifier'.
            String identifier = body.get("email");
            String password = body.get("password");

            if (identifier == null || password == null) {
                return ResponseEntity.badRequest().body(AutenticationResponse.builder().token("Brak identyfikatora lub hasła w żądaniu.").build());
            }

            return ResponseEntity.ok(service.autenticate(identifier, password));
        } catch (AuthenticationException e) {
            // Standardowa obsługa nieudanej autentykacji (np. złe hasło)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AutenticationResponse.builder().token("Błędny identyfikator lub hasło.").build());
        } catch (RuntimeException e) {
            // Inne błędy (np. brak użytkownika po uwierzytelnieniu)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AutenticationResponse.builder().token(e.getMessage()).build());
        }
    }
}