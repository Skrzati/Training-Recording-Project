// backend-api/routes/workout.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware JWT
const db = require('../config/db'); // Klient pg

// ------------------------------------------------------------------
// ENDPOINT: GET /workouts
// PRZEZNACZENIE: Pobierz treningi dla zalogowanego użytkownika
// DOSTĘP: Prywatny (wymaga nagłówka Authorization: Bearer <token>)
// ------------------------------------------------------------------
router.get('/', auth, async (req, res) => {
    // ID użytkownika zostało osadzone w req.user.id przez middleware 'auth'
    const userId = req.user.id; 
    
    try {
        // ZAPYTANIE SQL: Pobieranie treningów z PostgreSQL dla zalogowanego użytkownika
        const result = await db.query(
            'SELECT id, name, workout_date, duration_minutes FROM workouts WHERE user_id = $1 ORDER BY workout_date DESC', 
            [userId]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error('Błąd pobierania treningów:', err.message);
        res.status(500).send('Błąd serwera');
    }
});

module.exports = router;