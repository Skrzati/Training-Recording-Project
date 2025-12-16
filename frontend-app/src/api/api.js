import { getStoredToken } from '../context/AuthContext';

export const fetchWithAuth = async (endpoint, options = {}) => {
    
    const token = getStoredToken();
    const headers = options.headers || {};
    
    if (!token) {
        throw new Error("Brak tokena autoryzacji. Zaloguj się, aby uzyskać dostęp.");
    }

    headers['Authorization'] = token; 
    
    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const BASE_API_URL = 'http://localhost:8080/api.v1'; 
        const url = `${BASE_API_URL}${endpoint}`;

        const response = await fetch(url, config);
        
        const data = await response.json().catch(() => ({})); 

        if (response.ok) {
            return data;
        } else if (response.status === 401 || response.status === 403) {
            throw new Error(`Autoryzacja nieudana: ${data.message || 'Token niepoprawny lub wygasł.'}`);
        } else {
            throw new Error(`Błąd serwera: ${data.message || response.statusText}`);
        }
    } catch (error) {
        if (error instanceof TypeError) {
             throw new Error('Błąd sieci: Nie udało się połączyć z serwerem API.');
        }
        throw error;
    }
};