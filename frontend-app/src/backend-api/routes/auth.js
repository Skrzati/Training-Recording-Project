// backend-api/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; 

// ------------------------------------------------------------------
// ENDPOINT: POST /register
// PRZEZNACZENIE: Rejestracja nowego użytkownika
// OCZEKIWANE DANE: { username, email, password }
// ------------------------------------------------------------------
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Walidacja unikalności w PostgreSQL
        const userCheck = await db.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2', 
            [email, username]
        );
        
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Użytkownik o podanym emailu lub nazwie już istnieje.' });
        }

        // 2. Haszowanie hasła
        const salt = await bcrypt.genSalt(10);
        // Używamy kolumny 'password_hash' w bazie danych
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Zapis do PostgreSQL
        await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'Rejestracja zakończona pomyślnie. Możesz się zalogować.' });

    } catch (err) {
        console.error('Błąd rejestracji:', err.message);
        // Błąd 500 jest tu zwracany, jeśli problem jest np. z połączeniem DB
        res.status(500).json({ message: 'Błąd po stronie serwera (zobacz konsolę backendu).' });
    }
});

// ------------------------------------------------------------------
// ENDPOINT: POST /users/login
// PRZEZNACZENIE: Logowanie użytkownika
// OCZEKIWANE DANE: { email: string (z formularza username), password }
// ------------------------------------------------------------------
router.post('/users/login', async (req, res) => {
    // Frontend wysyła 'username' w polu 'email'
    const { email, password } = req.body; 

    try {
        // 1. Znajdź użytkownika po emailu i pobierz hash hasła
        const userResult = await db.query(
            'SELECT id, password_hash FROM users WHERE email = $1', 
            [email]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
        }
        
        const user = userResult.rows[0];
        
        // 2. Porównaj hasło z hashem z bazy (password_hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
        }

        // 3. Generowanie Tokenu JWT 
        const payload = { 
            user: {
                // Konwertujemy ID na number, jeśli PG zwróciło stringa (chociaż w PG to jest int)
                id: user.id 
            }
        };
        
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // 4. Zwracanie tokenu w NAGŁÓWKU Authorization (wymagane przez Twój frontend!)
        res.header('Authorization', `Bearer ${token}`)
           .status(200) 
           .json({ message: 'Login successful' }); 

    } catch (err) {
        console.error('Błąd logowania:', err.message);
        res.status(500).json({ message: 'Błąd po stronie serwera (zobacz konsolę backendu).' });
    }
});

module.exports = router;