// src/hooks/useLogin.js
import { useState } from 'react';
import { loginUser } from '../services/authService';

/**
 * Custom hook do zarządzania procesem logowania formularza.
 * @param {function} onLoginSuccess - Callback wywoływany z tokenem po sukcesie.
 */
export const useLogin = (onLoginSuccess) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const login = async (identifier, password) => {
        setIsLoading(true);
        setMessage('Logowanie w toku...');
        setIsError(false);

        try {
            const token = await loginUser(identifier, password);
            onLoginSuccess(token); 
            setMessage('Zalogowano pomyślnie!');
            
        } catch (error) {
            setMessage(`Logowanie nieudane: ${error.message}`);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, message, isError };
};