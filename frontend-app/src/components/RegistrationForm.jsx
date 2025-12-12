// frontend-app/src/components/RegistrationForm.jsx

import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/register';

/**
 * Komponent formularza rejestracji z logiką komunikacji z API.
 * @param {object} props
 * @param {function} props.onClose - Funkcja zamykająca modal.
 * @param {function} props.switchToLogin - Funkcja przełączająca na modal logowania.
 */
const RegistrationForm = ({ onClose, switchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
        setMessage('Rejestracja w toku...');
        setIsError(false);
        setIsLoading(true);

        try {
            // Walidacja hasła, którą miałeś w oryginalnym kodzie, została usunięta
            // na rzecz tej w LoginForm.jsx. Jeśli potrzebujesz jej tu, dodaj:
            if (formData.password.length < 6) {
                setMessage('Hasło musi mieć co najmniej 6 znaków.');
                setIsError(true);
                setIsLoading(false);
                return;
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                setMessage('Rejestracja pomyślna! Przekierowujemy do logowania.');
                setIsError(false);
                setFormData({ username: '', email: '', password: '' }); 
                
                // Po udanej rejestracji, poczekaj 2 sekundy i przełącz na logowanie
                setTimeout(switchToLogin, 2000); 

            } else {
                const errorData = await response.json().catch(() => ({ message: 'Wystąpił błąd po stronie serwera.' }));
                setMessage(`Błąd rejestracji: ${errorData.message || 'Wystąpił błąd po stronie serwera.'}`); 
                setIsError(true);
            }
        } catch (error) {
            console.error('Błąd połączenia z API:', error);
            setMessage('Błąd sieci: Nie udało się połączyć z serwerem (8080/register).');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <button className="close-modal" onClick={onClose} disabled={isLoading}>&times;</button>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika:</label>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
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
                    {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </button>
            </form>
            
            {message && (
                <p className={`status-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            <div className="switch-text">
                Masz już konto? <span onClick={switchToLogin}>Zaloguj się</span>
            </div>
        </div>
    );
};

export default RegistrationForm;