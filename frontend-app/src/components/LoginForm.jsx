import React, { useState } from 'react';
import './AuthForms.css'; // Upewnij się, że to jest!

const API_URL = 'http://localhost:8080/login';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ... (początek komponentu jest taki sam) ...

    // Funkcja do obsługi wysłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logowanie w toku...');
        setIsError(false);

        try {
            const response = await fetch(API_URL, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });

            // 1. Sprawdzamy, czy status HTTP to 2xx (np. 200 OK)
            if (response.ok) {
                // JEŚLI response.ok JEST TRUE, LOGOWANIE ZOSTAŁO UZNANE PRZEZ SERWER ZA UDANE
                
                setMessage('Logowanie Pomyślne! Jesteś zalogowany.');
                setIsError(false);
                setFormData({ username: '', password: '' }); 
                
                // TUTAJ W PRZYSZŁOŚCI DODAĆ LOGIKĘ PRZEKIEROWANIA LUB POBRANIA DANYCH
                
            } else {
                // 2. Obsługa BŁĘDÓW HTTP (np. 401 Unauthorized, 403 Forbidden)
                
                let errorMsg = 'Wystąpił nieznany błąd logowania.';
                
                // Specyficzna obsługa dla statusu 401 (Brak Autoryzacji)
                if (response.status === 401 || response.status === 403) {
                    errorMsg = 'Nieprawidłowa nazwa użytkownika lub hasło.';
                } else if (response.status) {
                    // W przypadku innych błędów (np. 500 Internal Server Error)
                    errorMsg = `Błąd Serwera (Status: ${response.status}).`;
                }
                
                // Próbujemy pobrać szczegółową wiadomość tekstową (jeśli serwer ją wysłał)
                const errorText = await response.text();
                if (errorText && errorText.length < 200) {
                     errorMsg = `${errorMsg} Szczegóły: ${errorText}`;
                }


                setMessage(`Błąd logowania: ${errorMsg.substring(0, 100)}...`); 
                setIsError(true);
            }
        } catch (error) {
            console.error('Błąd połączenia z API:', error);
            setMessage('Błąd sieci: Nie udało się połączyć z serwerem. Upewnij się, że Spring Boot działa i CORS jest poprawnie skonfigurowany.');
            setIsError(true);
        }
    };

// ... (reszta komponentu jest taka sama) ...

    return (
        <div className="auth-container">
            <h2>Logowanie użytkownika</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nazwa użytkownika:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Hasło:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="submit-button"
                >
                    Zaloguj się
                </button>
            </form>
            {message && (
                <p className={`status-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoginForm;