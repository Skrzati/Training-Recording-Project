// frontend-app/src/components/RegistrationForm.jsx (NOWA WERSJA)

import React, { useState } from 'react';

// UWAGA: ADRES URL ZGODNY Z SPRING BOOT
const API_URL = 'http://localhost:8080/api.v1/auth/register'; 

/**
 * Komponent formularza rejestracji z logiką komunikacji z API.
 * @param {object} props
 * @param {function} props.onClose - Funkcja zamykająca modal.
 * @param {function} props.switchToLogin - Funkcja przełączająca na modal logowania.
 */
const RegistrationForm = ({ onClose, switchToLogin }) => {
    // Stan formularza rozszerzony o osobne pola firstName, lastName i username
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

        const { password } = formData;
        
        // Dane do wysłania: wszystkie pola bezpośrednio z formData
        const dataToSend = formData; 

        try {
            if (password.length < 6) {
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
                body: JSON.stringify(dataToSend), 
            });

            const data = await response.json().catch(() => ({})); 

            if (response.ok || response.status === 201) {
                setMessage('Rejestracja pomyślna! Przekierowujemy do logowania.');
                setIsError(false);
                // Resetowanie formularza
                setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' }); 
                
                setTimeout(switchToLogin, 2000); 

            } else {
                // Obsługa błędów zwróconych przez Spring (np. 400 Bad Request przy nieunikalnym username/email)
                setMessage(`Błąd rejestracji: ${data.message || 'Wystąpił błąd po stronie serwera.'}`); 
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
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                {/* DODANE POLE: IMIĘ */}
                <div className="form-group">
                    <label htmlFor="firstName">Imię:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                {/* DODANE POLE: NAZWISKO */}
                <div className="form-group">
                    <label htmlFor="lastName">Nazwisko:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                {/* DODANE POLE: USERNAME (jako identyfikator do logowania) */}
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
                {/* POLE EMAIL */}
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
                {/* POLE HASŁO */}
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