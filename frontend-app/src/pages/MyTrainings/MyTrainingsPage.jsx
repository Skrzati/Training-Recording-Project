import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../api/api';
import styles from './MyTrainingsPage.module.css';

const MyTrainingsPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchWithAuth('/workouts/history');
                // Sortujemy dodatkowo po ID malejąco, aby najnowsze były zawsze na górze
                const sortedData = data.sort((a, b) => b.id - a.id);
                setWorkouts(sortedData);
            } catch (err) {
                console.error("Błąd pobierania historii:", err.message);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const formatDuration = (duration) => {
        if (!duration) return null;
        // Formatuje interwał ISO (PT1H30M) na czytelny tekst
        if (typeof duration === 'string' && duration.startsWith('PT')) {
            return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's');
        }
        return duration;
    };

    if (loading) return <div className={styles.loading}>Ładowanie Twoich osiągnięć... 🏋️‍♂️</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Moja Historia</h1>
                <p>Wyświetlam {workouts.length} zapisanych aktywności</p>
            </header>

            <div className={styles.grid}>
                {workouts.length === 0 ? (
                    <div className={styles.empty}>Brak zapisanych treningów. Czas na pierwszy krok!</div>
                ) : (
                    workouts.map(workout => (
                        <div key={workout.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <span className={workout.category?.categoryKey === 'run' ? styles.badgeRun : styles.badgeStrength}>
                                    {workout.category?.categoryKey === 'run' ? '🏃 BIEGANIE' : '💪 SIŁOWNIA'}
                                </span>
                                <span className={styles.date}>{workout.workoutDate}</span>
                            </div>
                            
                            <h3 className={styles.name}>{workout.name || "Bez nazwy"}</h3>
                            
                            <div className={styles.statsBox}>
                                {workout.category?.categoryKey === 'run' ? (
                                    <>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Dystans</span>
                                            <span className={styles.statValue}>
                                                {workout.runDetails?.distanceKm || '0'} km
                                            </span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Czas trwania</span>
                                            <span className={styles.statValue}>
                                                {formatDuration(workout.runDetails?.duration) || 
                                                 (workout.durationMinutes > 0 ? `${workout.durationMinutes} min` : '---')}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Serie</span>
                                            <span className={styles.statValue}>
                                                {workout.strengthDetails?.length || 0}
                                            </span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Najcięższy</span>
                                            <span className={styles.statValue}>
                                                {workout.strengthDetails?.[0]?.weight || 0} kg
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyTrainingsPage;