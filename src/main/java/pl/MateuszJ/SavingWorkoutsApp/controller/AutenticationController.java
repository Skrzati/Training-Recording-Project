package pl.MateuszJ.SavingWorkoutsApp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.MateuszJ.SavingWorkoutsApp.services.AutenticationService;

@RestController
@RequestMapping("/api.v1/auth")
public class AutenticationController {

    private final AutenticationService service;

    public AutenticationController(AutenticationService service){
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AutenticationResponse> regiser(@RequestBody RegisterRequest request){
        // Zostawiamy jak jest, ale musisz zaimplementować ControllerAdvice lub
        // użyć try-catch, aby złapać IllegalStateException z serwisu
        // i zwrócić ResponseEntity.badRequest()
        try {
            return  ResponseEntity.ok(service.register(request));
        } catch (IllegalStateException e) {
            // Zwraca status 400 z wiadomością o błędzie
            return ResponseEntity.badRequest().body(AutenticationResponse.builder().token(e.getMessage()).build());
        }
    }
    @PostMapping("/autenticate")
    public ResponseEntity<AutenticationResponse> regiser(@RequestBody AutenticationRequest request){
        return  ResponseEntity.ok(service.autenticate(request));
    }
}
