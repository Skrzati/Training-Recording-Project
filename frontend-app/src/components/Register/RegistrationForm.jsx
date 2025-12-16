// src/components/Register/RegistrationForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Poprawiona ścieżka
import { useRegistration } from '../../hooks/useRegistration'; // Poprawiona ścieżka
import styles from './RegistrationForm.module.css'; // Własny moduł CSS

const RegistrationForm = () => {
    // Logika UI (z Contextu)
    const { switchToLogin, closeAuthModal } = useAuth();
    
    // Stan formularza
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', username: '', email: '', password: '',
    });
    
    // Logika rejestracji (z Hooka)
    const { register, isLoading, message, isError } = useRegistration(() => {
        // Po pomyślnej rejestracji, przełączamy na modal logowania z opóźnieniem
        setTimeout(switchToLogin, 2000);
        // Reset formularza po sukcesie
        setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' }); 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(formData); 
    };

    return (
        <div className={styles.authContainer}>
            <button className={styles.closeModal} onClick={closeAuthModal} disabled={isLoading}>
                &times;
            </button>
            <h2>Rejestracja</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">Imię:</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} disabled={isLoading} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="lastName">Nazwisko:</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} disabled={isLoading} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Nazwa użytkownika:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} disabled={isLoading} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={isLoading} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Hasło:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} disabled={isLoading} required />
                </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </button>
            </form>
            
            {message && (
                <p className={`${styles.statusMessage} ${isError ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <div className={styles.switchText}>
                Masz już konto? <span onClick={switchToLogin}>Zaloguj się</span>
            </div>
        </div>
    );
};

export default RegistrationForm;