// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { logoutUser } from '../services/authService';

const AuthContext = createContext(null);

/**
 * Provider opakowujący całą aplikację, dostarczający stan i funkcje autoryzacji.
 */
export const getStoredToken = () => {
    return localStorage.getItem('userToken');
};
export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const isLoggedIn = !!userToken;
    
    // Używamy tego stanu do zarządzania tym, który modal jest otwarty
    const [authModal, setAuthModal] = useState(null); // 'login', 'register', lub null

    // Ładowanie tokena z localStorage przy starcie (trwałość sesji)
    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            setUserToken(storedToken);
            // Uwaga: Można tu dodać walidację tokena (np. czy nie wygasł)
        }
    }, []);

    /**
     * Obsługa udanego logowania.
     * @param {string} token - Token JWT/sesji z prefiksem 'Bearer '.
     */
    const handleLoginSuccess = (token) => {
        setUserToken(token);
        localStorage.setItem('userToken', token); // Zapis tokena
        setAuthModal(null); // Zamykamy modal
        // App.jsx będzie musiał obsłużyć zmianę widoku na 'new-training'
    };
    
    const handleLogout = () => {
        logoutUser(); // Usuwa z localStorage
        setUserToken(null);
        setAuthModal(null);
    };

    const value = useMemo(() => ({
        isLoggedIn,
        userToken,
        authModal,
        setAuthModal,
        handleLoginSuccess,
        handleLogout,
        switchToRegister: () => setAuthModal('register'),
        switchToLogin: () => setAuthModal('login'),
        closeAuthModal: () => setAuthModal(null),
    }), [isLoggedIn, userToken, authModal]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom Hook do używania stanu autoryzacji w dowolnym komponencie.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
    }
    return context;
};