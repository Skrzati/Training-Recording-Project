import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { fetchWithAuth } from '../../api/api'; 

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchDashboardData = async () => {
             setIsLoading(true);
             setError(null);

             try {
                // Wywołanie API z automatyczną autoryzacją
                const data = await fetchWithAuth('/dashboard'); 
                
                setStats(data);
                
             } catch (err) {
                console.error('Błąd ładowania Dashboardu:', err.message);
                setError(err.message);
             } finally {
                setIsLoading(false);
             }
        };

        fetchDashboardData();
    }, []); 

    if (isLoading) {
        return (
            <div className={`page-content ${styles.dashboardContainer}`}>
                <h1 className={styles.loading}>Ładowanie danych... 🏋️‍♂️</h1>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className={`page-content ${styles.dashboardContainer}`}>
                <h1 className={styles.error}>Błąd: {error}</h1>
                <p>Sprawdź, czy jesteś zalogowany lub czy backend działa na porcie 8080.</p>
            </div>
        );
    }
    
    // Jeśli stats są null (ale nie ma błędu), użyjemy placeholderów
    const displayStats = stats || { totalWorkouts: 'N/A', lastWorkout: 'N/A', currentStreak: 'N/A' };
    
    return (
        <div className={`page-content ${styles.dashboardContainer}`}>
            <h1 className={styles.header}>Witaj ponownie!</h1>
            <p className={styles.welcomeText}>Twój osobisty panel FitLOG jest gotowy.</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Łącznie Treningów</h3>
                    <p className={styles.statValue}>{displayStats.totalWorkouts}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Ostatni Trening</h3>
                    <p className={styles.statValue}>{displayStats.lastWorkout}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Obecna Seria</h3>
                    <p className={styles.statValue}>{displayStats.currentStreak}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;