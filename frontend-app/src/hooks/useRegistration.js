// src/hooks/useRegistration.js
import { useState } from 'react';
import { registerUser } from '../services/authService';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Custom hook do zarządzania procesem rejestracji.
 * @param {function} onRegistrationSuccess - Callback wywoływany po sukcesie.
 */
export const useRegistration = (onRegistrationSuccess) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const register = async (formData) => {
        setMessage('Rejestracja w toku...');
        setIsError(false);
        setIsLoading(true);

        const { password } = formData;
        
        // 1. Walidacja po stronie Frontendu
        if (password.length < MIN_PASSWORD_LENGTH) {
            setMessage(`Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`);
            setIsError(true);
            setIsLoading(false);
            return;
        }

        try {
            await registerUser(formData);
            
            setMessage('Rejestracja pomyślna! Przekierowujemy do logowania...');
            setIsError(false);
            
            // Wywołanie zewnętrznej akcji (np. switchToLogin)
            onRegistrationSuccess(); 
            
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            setMessage(`Błąd rejestracji: ${error.message}`);
            setIsError(true);
        } finally {
            // Ustawiamy loading na false tylko po otrzymaniu ostatecznej odpowiedzi (przed timeoutem)
            setIsLoading(false);
        }
    };

    return { register, isLoading, message, isError };
};