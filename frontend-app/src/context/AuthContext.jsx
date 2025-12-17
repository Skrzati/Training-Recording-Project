import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { logoutUser } from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'userToken'; // Jedyny klucz używany w aplikacji

export const getStoredToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    // Sprawdzamy czy nie jest to tekstowy "null" lub puste znaki
    if (!token || ["null", "undefined", ""].includes(token.trim())) {
        return null;
    }
    // Zwracamy token bez spacji na końcach
    return token.trim();
};

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(getStoredToken());
    const [authModal, setAuthModal] = useState(null);

    const handleLoginSuccess = (token) => {
        if (!token) return;
        const cleanToken = token.trim();
        // Czyścimy wszystko, aby nie było konfliktów ze starymi kluczami (np. 'token')
        localStorage.clear();
        localStorage.setItem(TOKEN_KEY, cleanToken);
        setUserToken(cleanToken);
        setAuthModal(null);
    };

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem(TOKEN_KEY);
        setUserToken(null);
        window.location.reload(); // Odświeżamy dla pewności czystego stanu
    };

    const value = useMemo(() => ({
        isLoggedIn: !!userToken,
        userToken,
        authModal,
        setAuthModal,
        handleLoginSuccess,
        handleLogout,
        switchToRegister: () => setAuthModal('register'),
        switchToLogin: () => setAuthModal('login'),
        closeAuthModal: () => setAuthModal(null),
    }), [userToken, authModal]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
    return context;
};