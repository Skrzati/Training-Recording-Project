// backend-api/server.js

const express = require('express');
const cors = require('cors');
// To inicjuje pulę połączeń Postgres
const db = require('./config/db'); 
require('dotenv').config();

const app = express();

// Konfiguracja CORS: Ważne, aby front-end mógł komunikować się z backendem
const PORT_FRONTEND = 'http://localhost:5173'; 
const corsOptions = {
    origin: PORT_FRONTEND, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // Umożliwienie frontendowi odczytania tokenu z nagłówka
    exposedHeaders: ['Authorization'], 
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware do parowania JSON z ciała żądania
app.use(express.json());

// --- DEFINICJA ENDPOINTÓW ---
// Używamy '/' jako prefiksu, więc endpointy z auth.js będą dostępne jako:
// /register
// /users/login

app.use('/', require('./routes/auth')); 

// Zabezpieczony endpoint
app.use('/workouts', require('./routes/workout')); 

// Uruchomienie serwera
const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));