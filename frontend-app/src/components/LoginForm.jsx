// frontend-app/src/components/LoginForm.jsx

import React, { useState } from 'react';
// Ważne: Wszystkie style są w App.css, więc ten plik nie musi importować dodatkowego CSS.

// UWAGA: ADRES URL ZMIENIONY, ABY PASOWAŁ DO SPRING BOOT (POST /api.v1/auth/autenticate)
const API_URL = 'http://localhost:8080/api.v1/auth/autenticate'; 

/**
 * Komponent formularza logowania z logiką komunikacji z API.
 * @param {object} props
 * @param {function} props.onClose - Funkcja zamykająca modal.
 * @param {function} props.switchToRegister - Funkcja przełączająca na modal rejestracji.
 * @param {function} props.onLoginSuccess - Funkcja wywoływana po udanym logowaniu, przyjmuje token.
 */
const LoginForm = ({ onClose, switchToRegister, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '', // Używamy tego jako 'email'
        password: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logowanie w toku...');
        setIsError(false);
        setIsLoading(true);

        const { username, password } = formData;
        
        try {
            // Spring oczekuje pól email i password
            const response = await fetch(API_URL, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // WAŻNE: WYSYŁAMY 'username' POD KLUCZEM 'email'
                body: JSON.stringify({ email: username, password }), 
            });
            
            // Odpowiedź Spring jest w JSON (czy to sukces, czy błąd)
            const data = await response.json().catch(() => ({})); 

            if (response.ok) { // Status 200-299
                
                // --- KLUCZOWA ZMIANA: Odczyt tokenu z Ciała JSON (z pola 'token') ---
                const rawToken = data.token; 
                
                if (rawToken) {
                    // Wymagane przez standard JWT: 'Bearer <token>'
                    const tokenWithPrefix = `Bearer ${rawToken}`; 
                    onLoginSuccess(tokenWithPrefix); // Zapis tokena
                    setMessage('Login successful!');
                } else {
                    setMessage('Login successful, but token not found in response.');
                    setIsError(true);
                }

            } else {
                // Obsługa błędu (np. 401 Unauthorized lub 500 Internal Server Error)
                setMessage(`Logowanie nieudane: ${data.message || response.statusText}`);
                setIsError(true);
            }
        } catch (error) {
            console.error('Błąd połączenia z API:', error);
            setMessage('Błąd sieci: Nie udało się połączyć z serwerem (8080).');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <button className="close-modal" onClick={onClose} disabled={isLoading}>&times;</button>
            <h2>Logowanie do FitLOG</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika (lub Email):</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
            </form>
            
            {message && (
                <p className={`status-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            <div className="switch-text">
                Nie masz konta? <span onClick={switchToRegister}>Zarejestruj się!</span>
            </div>
        </div>
    );
};

export default LoginForm;