// src/services/authService.js (ZMODYFIKOWANA WERSJA)

// --------------------------------------------------------
// --- 1. Konfiguracja Adresów URL (symulacja ENV) ---
// --------------------------------------------------------

// Zmienne środowiskowe powinny być zdefiniowane w pliku .env
const BASE_URL = 'http://localhost:8080/api.v1/auth'; 

const LOGIN_URL = `${BASE_URL}/authenticate`; // Poprawiona ortografia
const REGISTER_URL = `${BASE_URL}/register`;


// --------------------------------------------------------
// --- 2. Funkcja pomocnicza do obsługi zapytań API (Fetch Helper) ---
// --------------------------------------------------------

/**
 * Obsługuje wywołanie fetch, parsowanie JSON i rzucanie błędów dla statusów != 2xx.
 * Upraszcza logikę w głównych funkcjach.
 * @param {string} url - Adres URL endpointu.
 * @param {object} options - Opcje dla fetch (method, headers, body).
 * @returns {Promise<object>} Obiekt danych zwrócony przez serwer.
 * @throws {Error} Konkretny błąd z wiadomością od serwera lub błąd sieci.
 */
const handleApiCall = async (url, options) => {
    try {
        const response = await fetch(url, options);
        // Próba odczytu ciała, nawet w przypadku błędów
        const data = await response.json().catch(() => ({})); 

        if (!response.ok) {
            // Logika błędu: najpierw wiadomość serwera, potem status, na końcu ogólny opis.
            // Zachowujemy specyficzną logikę z "data.token" dla kompatybilności wstecznej, 
            // jeśli serwer zwraca błąd w tym polu.
            const errorMessage = data.message 
                || data.token 
                || `Błąd serwera (${response.status}): ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Sukces (status 200-299)
        return data; 

    } catch (error) {
        // Obsługa błędów sieci (np. serwer nie działa/odrzucił połączenie)
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Błąd sieci: Nie udało się połączyć z serwerem. Czy backend działa na porcie 8080?');
        }
        // Rzuć dalej błąd rzucony w bloku if (!response.ok)
        throw error; 
    }
};


// --------------------------------------------------------
// --- 3. Funkcje publiczne (Właściwa Logika) ---
// --------------------------------------------------------

/**
 * Wywołuje endpoint logowania.
 * @param {string} identifier - Nazwa użytkownika lub Email (mapowane na 'email' dla backendu).
 * @param {string} password - Hasło.
 * @returns {Promise<string>} Token JWT z prefiksem 'Bearer '.
 * @throws {Error} Jeśli logowanie nie powiedzie się lub brakuje tokena.
 */
export const loginUser = async (identifier, password) => {
    const payload = { email: identifier, password }; 

    const data = await handleApiCall(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    
    // Specyficzna logika po sukcesie: sprawdzanie obecności tokena
    if (!data.token) {
        throw new Error('Logowanie udane, ale serwer nie zwrócił tokena.');
    }

    return `Bearer ${data.token}`;
};


/**
 * Wywołuje endpoint rejestracji.
 * @param {object} userData - Dane rejestracyjne: firstName, lastName, username, email, password.
 * @returns {Promise<object>} Zwraca obiekt danych z sukcesu rejestracji (jeśli istnieje).
 * @throws {Error} Jeśli rejestracja nie powiedzie się.
 */
export const registerUser = async (userData) => {
    // W zasadzie tylko opakowujemy wywołanie handleApiCall
    const data = await handleApiCall(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    
    // Możesz tu sprawdzić, czy odpowiedź zawiera jakieś specyficzne dane
    return data;
};


/**
 * Funkcja do wylogowania (lokalna).
 */
export const logoutUser = () => {
    localStorage.removeItem('userToken');
    // W profesjonalnej aplikacji, tu byłoby wywołanie API do unieważnienia tokena odświeżającego
};