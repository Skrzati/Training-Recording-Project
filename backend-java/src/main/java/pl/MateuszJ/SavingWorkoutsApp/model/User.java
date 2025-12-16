package pl.MateuszJ.SavingWorkoutsApp.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "Users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    private String password;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    public enum Role {
        USER,
        ADMIN
    }

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    // ----------------------------------------------------
    // RĘCZNA IMPLEMENTACJA BUILDER I KONSTRUKTORÓW
    // ----------------------------------------------------

    // 1. Konstruktor bezargumentowy (dla JPA)
    public User() {
    }

    // 2. Konstruktor pełny (używany przez UserBuilder.build())
    private User(Integer id, String firstName, String lastName, String password, String username, String email, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // 3. Statyczna metoda builder()
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // 4. Ręczna Klasa Budowniczego
    public static class UserBuilder {
        private Integer id;
        private String firstName;
        private String lastName;
        private String password;
        private String username;
        private String email;
        private Role role;

        // Metody ustawiające pola
        public UserBuilder id(Integer id) { this.id = id; return this; }
        public UserBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder username(String username) { this.username = username; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }

        // Metoda budująca obiekt
        public User build() {
            return new User(this.id, this.firstName, this.lastName, this.password, this.username, this.email, this.role);
        }
    }

    // ----------------------------------------------------
    // IMPLEMENTACJA USERDETAILS (pozostawiona bez zmian)
    // ----------------------------------------------------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Ręczne Gettery i Settery (pozostawione, choć @Data je generuje)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }
}