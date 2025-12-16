// src/components/Login/LoginForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLogin } from '../../hooks/useLogin'; 
import styles from './LoginForm.module.css'; // Własny moduł CSS

const LoginForm = () => {
    // Logika UI (z Contextu)
    const { handleLoginSuccess, closeAuthModal, switchToRegister } = useAuth();
    
    // Hook zarządzający logiką wywołania API
    const { login, isLoading, message, isError } = useLogin((token) => {
        handleLoginSuccess(token);
        closeAuthModal(); // Zamykamy modal automatycznie po sukcesie
    });
    
    // Lokalny stan formularza
    const [formData, setFormData] = useState({
        identifier: '', // Używamy 'identifier'
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.identifier, formData.password);
    };

    return (
        <div className={styles.authContainer}>
            <button 
                className={styles.closeModal} 
                onClick={closeAuthModal} 
                disabled={isLoading}
            >
                &times;
            </button>
            <h2>Logowanie do FitLOG</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="identifier">Nazwa użytkownika (lub Email):</label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
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
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
            </form>
            
            {message && (
                <p className={`${styles.statusMessage} ${isError ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <div className={styles.switchText}>
                Nie masz konta? <span onClick={switchToRegister}>Zarejestruj się!</span>
            </div>
        </div>
    );
};

export default LoginForm;