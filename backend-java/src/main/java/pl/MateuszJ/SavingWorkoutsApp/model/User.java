package pl.MateuszJ.SavingWorkoutsApp.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Pole firstName przestaje być unikalne
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String username; // NOWE POLE

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    public enum Role {
        USER,
        ADMIN
    }
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // JAWNY KONSTRUKTOR WYMAGANY PRZEZ JPA/HIBERNATE
    public User() {}

    // JAWNY KONSTRUKTOR WYMAGANY PRZEZ BUILDERA
    private User(String firstName, String lastName, String username, String email, String password, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username; // DODANO
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // JAWNA METODA BUILDER()
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // JAWNA KLASA BUILDERA
    public static class UserBuilder {
        private String firstName;
        private String lastName;
        private String username; // DODANO
        private String email;
        private String password;
        private Role role;

        public UserBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        public UserBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        public UserBuilder username(String username) { // DODANO
            this.username = username;
            return this;
        }
        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }
        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }
        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }
        public User build() {
            return new User(firstName, lastName, username, email, password, role);
        }
    }

    // --- Gettery/Settery ---
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role) { this.role = role; }
    // DODANO getter dla username
    public String getUsernameField() { return username; }


    // --- Implementacja UserDetails ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() { return username; } // ZMIENIONO: Teraz zwraca pole 'username'

    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}