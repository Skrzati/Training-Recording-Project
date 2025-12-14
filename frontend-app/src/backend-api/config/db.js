// backend-api/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Konfiguracja puli połączeń z PostgreSQL
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.on('error', (err, client) => {
  console.error('Błąd w puli połączeń Postgres:', err);
  process.exit(-1);
});

console.log('PostgreSQL Pool initialized.');

// Funkcja do wykonywania zapytań
module.exports = {
    query: (text, params) => pool.query(text, params),
};