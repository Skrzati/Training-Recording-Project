package pl.MateuszJ.SavingWorkoutsApp.controller;

public class AutenticationRequest {
    private String email;
    private String password;

    // Konstruktor bezargumentowy
    public AutenticationRequest() {}

    // Konstruktor z argumentami
    public AutenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // JAWNE GETTERY (usuwa błędy 44, 45)
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}