/**
 * src/services/authService.js
 */

const BASE_URL = 'http://localhost:8080/api/v1/auth';

/**
 * Logowanie użytkownika
 * @param {string} email - Adres email użytkownika
 * @param {string} password - Hasło
 * @returns {Promise<string>} Zwraca "czysty" token JWT (bez słowa Bearer)
 */
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Obsługa błędów z backendu (np. "Bad credentials")
            throw new Error(data.message || 'Nieprawidłowe dane logowania.');
        }

        if (!data.token) {
            throw new Error('Serwer nie zwrócił tokena autoryzacyjnego.');
        }

        /**
         * KLUCZOWA ZMIANA: Zwracamy sam token. 
         * Słowo "Bearer " zostanie dodane automatycznie w api.js przed wysyłką.
         */
        return data.token; 

    } catch (error) {
        console.error("[AuthService] Login Error:", error.message);
        throw error;
    }
};

/**
 * Rejestracja nowego użytkownika
 * @param {object} userData - Obiekt z danymi (firstName, lastName, email, password)
 */
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Rejestracja nie powiodła się.');
        }

        return data; // Zazwyczaj zwraca obiekt użytkownika lub token
    } catch (error) {
        console.error("[AuthService] Register Error:", error.message);
        throw error;
    }
};

/**
 * Wylogowanie użytkownika (czyści stan lokalny)
 */
export const logoutUser = () => {
    localStorage.removeItem('userToken');
    // Jeśli używasz dodatkowych kluczy, wyczyść je tutaj
};