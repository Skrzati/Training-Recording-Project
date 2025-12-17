import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/api';
import styles from './MyTrainingsPage.module.css';
import WorkoutDetails from '../../components/WorkoutDetails/WorkoutDetails'; // NOWY KOMPONENT

const MyTrainingsPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Stan do zarządzania widokiem detali
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
    const [selectedWorkoutName, setSelectedWorkoutName] = useState('');

    // Formatowanie daty dla czytelności
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString; 
        }
    };

    // Funkcja do ładowania listy treningów
    const fetchWorkouts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // GET /workouts (wymaga autoryzacji)
            const data = await fetchWithAuth('/workouts'); 
            setWorkouts(data);
        } catch (err) {
            console.error('Błąd ładowania treningów:', err);
            setError(`Nie udało się załadować listy: ${err.message || 'Błąd serwera'}.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []); 

    // Przełączanie na widok detali
    const handleViewDetails = (id, name) => {
        setSelectedWorkoutId(id);
        setSelectedWorkoutName(name);
    };

    // Powrót do widoku listy
    const handleBackToList = () => {
        setSelectedWorkoutId(null);
        setSelectedWorkoutName('');
        // Można odświeżyć listę po powrocie, jeśli zajdzie potrzeba
        // fetchWorkouts(); 
    };

    // --- RENDEROWANIE WIDOKÓW ---

    if (isLoading) {
        return (
            <div className={`page-content ${styles.trainingsContainer}`}>
                <h1 className={styles.header}>Moje Treningi</h1>
                <p>Ładowanie listy... 🏋️</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className={`page-content ${styles.trainingsContainer}`}>
                <h1 className={styles.header}>Błąd</h1>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }
    
    // 1. Widok szczegółów (po wybraniu ID)
    if (selectedWorkoutId) {
        return (
            <WorkoutDetails 
                workoutId={selectedWorkoutId} 
                workoutName={selectedWorkoutName}
                onBack={handleBackToList} 
            />
        );
    }
    
    // 2. Widok listy treningów
    return (
        <div className={`page-content ${styles.trainingsContainer}`}>
            <h1 className={styles.header}>Moje Treningi ({workouts.length})</h1>

            {workouts.length === 0 ? (
                <p>Jeszcze nie dodałeś żadnych treningów! Zacznij od strony "Nowy Trening".</p>
            ) : (
                <ul className={styles.workoutsList}>
                    {workouts.map(workout => (
                        <li key={workout.id} className={styles.workoutItem}>
                            <div className={styles.workoutInfo}>
                                <h3 className={styles.workoutName}>{workout.name}</h3>
                                <p className={styles.workoutDate}>{formatDate(workout.workout_date)}</p>
                            </div>
                            <div className={styles.workoutMeta}>
                                <span className={styles.metaItem}>Kategoria: <strong>{workout.category_name}</strong></span>
                                <span className={styles.metaItem}>Czas: {workout.duration_minutes || 'N/A'} min</span>
                            </div>
                            <button 
                                className={styles.detailsButton} 
                                onClick={() => handleViewDetails(workout.id, workout.name)}
                            >
                                Zobacz Detale
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyTrainingsPage;