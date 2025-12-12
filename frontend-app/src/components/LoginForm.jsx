// frontend-app/src/components/LoginForm.jsx

import React, { useState } from 'react';
// Ważne: Wszystkie style są w App.css, więc ten plik nie musi importować dodatkowego CSS.

const API_URL = 'http://localhost:8080/login';

/**
 * Komponent formularza logowania z logiką komunikacji z API.
 * @param {object} props
 * @param {function} props.onClose - Funkcja zamykająca modal.
 * @param {function} props.switchToRegister - Funkcja przełączająca na modal rejestracji.
 * @param {function} props.onLoginSuccess - Funkcja wywoływana po udanym logowaniu, przyjmuje token.
 */
const LoginForm = ({ onClose, switchToRegister, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '', // Używam username, ale możesz zmienić na email w zależności od backendu
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

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Załóżmy, że backend zwraca obiekt { token: '...' } lub podobny
                const data = await response.json(); 
                
                // Kluczowy moment: przekazanie tokena i wywołanie sukcesu
                onLoginSuccess(data.token); 
                
                setMessage('Zalogowano pomyślnie! Przekierowanie...');
                // Zamknięcie modala następuje w App.jsx po wywołaniu onLoginSuccess
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Niepoprawny login lub hasło.' }));
                setMessage(`Błąd logowania: ${errorData.message || 'Wystąpił błąd po stronie serwera.'}`);
                setIsError(true);
            }
        } catch (error) {
            console.error('Błąd połączenia z API:', error);
            setMessage('Błąd sieci: Nie udało się połączyć z serwerem (http://localhost:8080/login).');
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