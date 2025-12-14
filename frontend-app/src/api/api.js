/**
 * Wysłanie żądania do API z automatycznym dołączeniem tokena JWT, jeśli jest dostępny.
 * @param {string} endpoint - Ścieżka do API (np. '/workouts').
 * @param {object} options - Opcje dla funkcji fetch (np. method, body).
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(endpoint, options = {}) {
  // 1. Pobierz token z localStorage
  const token = localStorage.getItem('token');
  
  // 2. Przygotuj nagłówki
  const headers = {
    ...options.headers,
    // Ustawienie Content-Type na JSON jest dobrym zwyczajem, 
    // chyba że przesyłasz pliki (FormData)
    'Content-Type': 'application/json',
  };

  // 3. Dodaj nagłówek Authorization, jeśli token istnieje
  if (token) {
    // Backend oczekuje, że cały nagłówek (np. 'Bearer <token>') zostanie użyty.
    // Domyślnie, token powinien być zapisany w formacie 'Bearer xxx.yyy.zzz'
    headers['Authorization'] = token;
  }
  
  // 4. Upewnij się, że body jest stringiem, jeśli headers.Content-Type to application/json
  let body = options.body;
  if (headers['Content-Type'] === 'application/json' && typeof options.body === 'object' && options.body !== null) {
      body = JSON.stringify(options.body);
  }

  // 5. Wyślij żądanie do API
  const response = await fetch(endpoint, {
    ...options,
    headers,
    body: body,
  });

  // 6. Opcjonalnie: obsłuż status 401/403 (Unauthorized/Forbidden)
  if (response.status === 401 || response.status === 403) {
      // W przypadku braku autoryzacji, usuń token i przekieruj do logowania
      localStorage.removeItem('token');
      console.error('Brak autoryzacji. Usuwam token i przekierowuję do logowania.');
      // window.location.href = '/login'; // Opcjonalne przekierowanie
  }

  return response;
}