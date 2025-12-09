import React, { useState } from 'react';

// Adres Twojego backendu Spring Boot
const API_URL = 'http://localhost:8080/users';

const RegistrationForm = () => {
    // Stan do przechowywania danych formularza
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Funkcja do aktualizacji stanu przy zmianie inputów
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Funkcja do obsługi wysłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Rejestracja w toku...');
        setIsError(false);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Wysyłamy dane jako JSON, który pasuje do modelu User.java
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                setMessage('Rejestracja pomyślna! Witamy na pokładzie.');
                setIsError(false);
                setFormData({ username: '', email: '', password: '' }); // Reset
            } else {
                // Obsługa błędów, np. walidacji (np. login już zajęty)
                const errorText = await response.text();
                setMessage(`Błąd rejestracji: ${errorText.substring(0, 100)}...`); 
                setIsError(true);
            }
        } catch (error) {
            console.error('Błąd połączenia z API:', error);
            setMessage('Błąd sieci: Nie udało się połączyć z serwerem. Upewnij się, że Spring Boot działa.');
            setIsError(true);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial' }}>
            <h2>Rejestracja nowego użytkownika</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nazwa użytkownika:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Hasło:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Zarejestruj się
                </button>
            </form>
            {message && (
                <p style={{ color: isError ? 'red' : 'green', marginTop: '15px', fontWeight: 'bold' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default RegistrationForm;