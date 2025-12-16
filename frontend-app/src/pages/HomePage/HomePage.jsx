// src/pages/HomePage.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import contextu do otwierania modali
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa'; // Ikony dla przycisków
import styles from './HomePage.module.css'; // Dodamy nowy moduł CSS dla specyficznych stylów!

const HomePage = () => {
    // Używamy useAuth, aby móc otworzyć modale Logowania/Rejestracji
    const { setAuthModal } = useAuth(); 

    return (
        <div className={`page-content ${styles.homeContainer}`}>
            <h1 className={styles.mainHeader}>
                <span className={styles.fitText}>Fit</span><span className={styles.logText}>LOG</span> 
                — Osiągnij Maksymalny Potencjał.
            </h1>
            
            <p className={styles.tagline}>
                Twoje dane, Twoje wyniki, Twoja motywacja.
            </p>

            <div className={styles.ctaGrid}>
                <div className={styles.featureCard}>
                    <h2>Śledź Postępy</h2>
                    <p>Zapomnij o notatnikach. Wszystkie serie, powtórzenia i ciężary w jednym, intuicyjnym miejscu.</p>
                </div>
                <div className={styles.featureCard}>
                    <h2>Analizuj Statystyki</h2>
                    <p>Oblicz objętość, monitoruj siłę i zobacz, gdzie Twój plan treningowy działa najlepiej.</p>
                </div>
                <div className={styles.featureCard}>
                    <h2>Osiągaj Rekordy</h2>
                    <p>Powiadomienia o nowych rekordach osobistych motywują do ciągłego podnoszenia poprzeczki.</p>
                </div>
            </div>

            <div className={styles.authButtons}>
                <button 
                    className={`${styles.authBtn} ${styles.registerBtn}`} 
                    onClick={() => setAuthModal('register')}
                >
                    <FaUserPlus /> Zarejestruj się za darmo
                </button>
                <button 
                    className={`${styles.authBtn} ${styles.loginBtn}`} 
                    onClick={() => setAuthModal('login')}
                >
                    <FaSignInAlt /> Zaloguj się
                </button>
            </div>
            
            <p className={styles.bottomText}>
                Dołącz do tysięcy użytkowników śledzących swoją drogę do fitnessu.
            </p>
        </div>
    );
};

export default HomePage;