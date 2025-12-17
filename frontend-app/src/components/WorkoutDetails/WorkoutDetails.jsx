import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/api';
import styles from './WorkoutDetails.module.css'; // Wymaga pliku CSS

const WorkoutDetails = ({ workoutId, workoutName, onBack }) => {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formatowanie czasu (sekundy na minuty:sekundy)
    const formatTime = (seconds) => {
        if (!seconds || typeof seconds !== 'number') return 'N/A';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds} sek`;
    };
    
    // Funkcja do ładowania szczegółów
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // GET /workouts/:id (wymaga autoryzacji)
                const data = await fetchWithAuth(`/workouts/${workoutId}`); 
                setDetails(data);
            } catch (err) {
                console.error('Błąd ładowania detali:', err);
                setError(`Nie udało się załadować detali: ${err.message || 'Błąd serwera'}.`);
            } finally {
                setIsLoading(false);
            }
        };

        if (workoutId) {
            fetchDetails();
        }
    }, [workoutId]); 

    // --- RENDEROWANIE ---

    if (isLoading) {
        return (
            <div className={`page-content ${styles.detailsContainer}`}>
                <button onClick={onBack} className={styles.backButton}>&larr; Powrót do Listy</button>
                <h1 className={styles.header}>Szczegóły: {workoutName}</h1>
                <p>Ładowanie szczegółów...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`page-content ${styles.detailsContainer}`}>
                <button onClick={onBack} className={styles.backButton}>&larr; Powrót do Listy</button>
                <h1 className={styles.header}>Błąd: {workoutName}</h1>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }
    
    if (!details) {
         return (
            <div className={`page-content ${styles.detailsContainer}`}>
                <button onClick={onBack} className={styles.backButton}>&larr; Powrót do Listy</button>
                <h1 className={styles.header}>Szczegóły: {workoutName}</h1>
                <p>Brak danych o treningu.</p>
            </div>
        );
    }

    // Wybór, który widok detali wyświetlić
    const DetailsComponent = details.category_key === 'run' 
        ? RunDetailsView 
        : StrengthDetailsView;

    return (
        <div className={`page-content ${styles.detailsContainer}`}>
            <button onClick={onBack} className={styles.backButton}>&larr; Powrót do Listy</button>
            
            <h1 className={styles.header}>{details.name}</h1>
            <p className={styles.meta}>Data: {new Date(details.workout_date).toLocaleDateString()}</p>
            <p className={styles.meta}>Typ: <strong>{details.category_name}</strong></p>
            <p className={styles.meta}>Czas: {details.duration_minutes || 'N/A'} min</p>
            
            {details.notes && <div className={styles.notes}><h3>Notatki</h3><p>{details.notes}</p></div>}
            
            <DetailsComponent details={details} formatTime={formatTime} />
            
        </div>
    );
};

// --- KOMPONENTY WIDOKÓW SZCZEGÓŁÓW ---

const RunDetailsView = ({ details, formatTime }) => {
    const runDetails = details.details || {}; // 1:1 relacja

    return (
        <div className={styles.runDetails}>
            <h2>Metryki Biegu</h2>
            <div className={styles.metricGrid}>
                <div className={styles.metricCard}>
                    <p>Dystans</p>
                    <h3>{runDetails.distance_km} km</h3>
                </div>
                <div className={styles.metricCard}>
                    <p>Czas</p>
                    <h3>{formatTime(runDetails.time_seconds)}</h3>
                </div>
                <div className={styles.metricCard}>
                    <p>Średnie Tętno</p>
                    <h3>{runDetails.average_heart_rate || 'N/A'} BPM</h3>
                </div>
                <div className={styles.metricCard}>
                    <p>Maks. Tętno</p>
                    <h3>{runDetails.max_heart_rate || 'N/A'} BPM</h3>
                </div>
            </div>
        </div>
    );
};

const StrengthDetailsView = ({ details }) => {
    const strengthDetails = details.details || []; // 1:N relacja

    // Grupujemy serie po nazwie ćwiczenia
    const groupedExercises = strengthDetails.reduce((acc, item) => {
        const key = item.exercise_name || 'Brak nazwy ćwiczenia';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div className={styles.strengthDetails}>
            <h2>Zestawienie Ćwiczeń</h2>
            {Object.keys(groupedExercises).map(exerciseName => (
                <div key={exerciseName} className={styles.exerciseGroup}>
                    <h3>{exerciseName}</h3>
                    <table className={styles.setsTable}>
                        <thead>
                            <tr>
                                <th>Seria</th>
                                <th>Powtórzenia</th>
                                <th>Ciężar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedExercises[exerciseName].map(set => (
                                <tr key={set.set_number}>
                                    <td>{set.set_number}</td>
                                    <td>{set.repetitions || 'N/A'}</td>
                                    <td>{set.weight ? `${set.weight} ${set.unit}` : 'Ciężar własny/N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};


export default WorkoutDetails;