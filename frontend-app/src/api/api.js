// frontend-app/src/api/api.js (NAPRAWIA BŁĘDY IMPORTU I ŹLE MAPOWANE ŚCIEŻKI)

import { getStoredToken } from '../context/AuthContext'; 

const fetchBase = async (endpoint, options = {}, isPublic = false) => {
    
    const token = getStoredToken();
    const headers = options.headers || {};
    
    if (!isPublic && !token) {
        throw new Error("Brak tokena autoryzacji. Zaloguj się, aby uzyskać dostęp.");
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }
    
    if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const BASE_API_URL = 'http://localhost:8080/api/v1'; 
        const url = `${BASE_API_URL}${endpoint}`;

        const response = await fetch(url, config);
        
        const data = await response.json().catch(() => ({})); 

        if (response.ok) {
            return data;
        } else if (response.status === 401 || response.status === 403) {
            throw new Error(`Autoryzacja nieudana: ${data.msg || data.message || 'Token niepoprawny lub wygasł.'}`);
        } else {
            throw new Error(`Błąd serwera: ${data.msg || response.statusText}`);
        }
    } catch (error) {
        if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
             throw new Error('Błąd sieci: Nie udało się połączyć z serwerem API. Sprawdź, czy serwer działa.');
        }
        throw error;
    }
};

// 1. Nazwany eksport (dla modułów używających import { fetchWithAuth } from '...')
export const fetchWithAuth = fetchBase;

// 2. Eksport domyślny (dla modułów używających import api from '...')
export default fetchBase;