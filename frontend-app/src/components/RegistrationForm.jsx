import React, { useState } from 'react';
import './AuthForms.css'; // Upewnij się, że to jest!

const API_URL = 'http://localhost:8080/register';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                setMessage('Rejestracja pomyślna! Witamy na pokładzie.');
                setIsError(false);
                setFormData({ username: '', email: '', password: '' }); 
            } else {
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
        <div className="auth-container">
            <h2>Rejestracja nowego użytkownika</h2>
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
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                    Zarejestruj się
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

export default RegistrationForm;