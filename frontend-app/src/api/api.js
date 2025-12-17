import { getStoredToken } from '../context/AuthContext';

const BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Uniwersalna funkcja do zapytań API z automatyczną autoryzacją.
 * Rozwiązuje problem "Malformed JWT" poprzez sanityzację tokena.
 */
export const fetchWithAuth = async (endpoint, options = {}, isPublic = false) => {
    let token = getStoredToken();
    
    // 1. Inicjalizacja nagłówków
    const headers = new Headers(options.headers || {});
    
    // 2. Automatyczny Content-Type dla żądań z body
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // 3. Obsługa autoryzacji
    if (!isPublic) {
        if (!token) {
            console.error("[API] Blokada: Brak tokena dla", endpoint);
            throw new Error("Sesja wygasła. Zaloguj się ponownie.");
        }

        // --- KLUCZOWA POPRAWKA DLA "Malformed JWT" ---
        // Usuwamy prefiks "Bearer ", jeśli już tam jest (aby uniknąć Bearer Bearer ...)
        // Usuwamy cudzysłowy i wszelkie znaki niedrukowalne (krzaki z logów)
        let cleanToken = token
            .replace(/^Bearer\s+/i, '') // Usuwa "Bearer " z początku (niezależnie od wielkości liter)
            .replace(/["']/g, '')       // Usuwa cudzysłowy
            .trim();                    // Usuwa białe znaki

        // Ostateczne czyszczenie: dopuszczamy tylko znaki standardowe dla Base64/JWT
        cleanToken = cleanToken.replace(/[^a-zA-Z0-9.\-_]/g, '');

        headers.set('Authorization', `Bearer ${cleanToken}`);
    }

    try {
        const url = `${BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers
        });

        // Obsługa braku uprawnień
        if (response.status === 403) {
            console.error("[API] 403 Forbidden - Sprawdź ważność tokena lub role użytkownika.");
            throw new Error("Brak uprawnień lub sesja wygasła (403).");
        }

        if (response.status === 401) {
            throw new Error("Nieautoryzowany dostęp (401).");
        }

        // Pobieramy odpowiedź jako tekst, by uniknąć błędów przy pustym body
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            throw new Error(data.message || `Błąd serwera: ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            console.error("[API Error]: Brak połączenia z serwerem CORS/Network.");
            throw new Error("Błąd połączenia z serwerem. Sprawdź backend.");
        }
        console.error("[API Error]:", error.message);
        throw error;
    }
};

export default fetchWithAuth;