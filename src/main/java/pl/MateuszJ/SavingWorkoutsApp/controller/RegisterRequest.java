package pl.MateuszJ.SavingWorkoutsApp.controller;

public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String username; // DODANO: Nowe unikalne pole
    private String email;
    private String password;

    // Konstruktor bezargumentowy
    public RegisterRequest() {}

    // Konstruktor z argumentami
    public RegisterRequest(String firstName, String lastName, String username, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username; // DODANO
        this.email = email;
        this.password = password;
    }

    // JAWNE GETTERY
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getUsername() { return username; } // DODANO
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}