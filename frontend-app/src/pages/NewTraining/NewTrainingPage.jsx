import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Dodane dla płynnego przejścia
import { fetchWithAuth } from '../../api/api';
import styles from './NewTrainingPage.module.css';

const CATEGORIES = [
    { key: 'strength', name: 'Trening Siłowy' },
    { key: 'run', name: 'Bieganie' }
];

const NewTrainingPage = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState('strength');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        workout_date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        notes: ''
    });

    const [strengthDetails, setStrengthDetails] = useState({ 
        exercise_name: '', 
        repetitions: '', 
        weight: '' 
    });

    const [runDetails, setRunDetails] = useState({ 
        distance_km: '', 
        hours: '0', 
        minutes: '0', 
        seconds: '0', 
        average_heart_rate: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', msg: '' });

        // PRZYGOTOWANIE DETAILS ZGODNIE Z TYPEM KATEGORII
        let details;
        if (selectedKey === 'strength') {
            details = [{ ...strengthDetails, set_number: 1 }];
        } else {
            // KLUCZOWE: Musimy wysłać te same klucze, których szuka Twój Service (hours, minutes, seconds)
            details = { 
                distance_km: runDetails.distance_km,
                hours: runDetails.hours || '0',
                minutes: runDetails.minutes || '0',
                seconds: runDetails.seconds || '0',
                average_heart_rate: runDetails.average_heart_rate
            };
        }

        const payload = {
            ...formData,
            category_key: selectedKey,
            duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : 0,
            details: details
        };

        try {
            await fetchWithAuth('/workouts', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            setStatus({ type: 'success', msg: 'Trening zapisany! Przenoszę do historii...' });
            
            // Przekierowanie do historii po sukcesie
            setTimeout(() => {
                navigate('/history');
            }, 1500);

        } catch (err) {
            setStatus({ type: 'error', msg: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <h2 className={styles.title}>Dodaj Nowy Trening</h2>
                
                {status.msg && (
                    <div className={status.type === 'error' ? styles.errorAlert : styles.successAlert}>
                        {status.msg}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Typ aktywności</label>
                        <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Nazwa treningu</label>
                        <input 
                            type="text" 
                            placeholder="np. Trening klatki / Poranny bieg" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Data</label>
                            <input 
                                type="date" 
                                value={formData.workout_date} 
                                onChange={e => setFormData({...formData, workout_date: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Czas (min)</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                value={formData.duration_minutes} 
                                onChange={e => setFormData({...formData, duration_minutes: e.target.value})} 
                            />
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.dynamicSection}>
                        <h4 className={styles.sectionSubtitle}>
                            Dane: {selectedKey === 'strength' ? 'Siła' : 'Bieganie'}
                        </h4>
                        
                        {selectedKey === 'strength' ? (
                            <div className={styles.detailsGrid}>
                                <div className={styles.formGroup}>
                                    <label>Nazwa ćwiczenia</label>
                                    <input 
                                        type="text" 
                                        placeholder="np. Martwy ciąg" 
                                        value={strengthDetails.exercise_name}
                                        onChange={e => setStrengthDetails({...strengthDetails, exercise_name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Ciężar (kg)</label>
                                        <input 
                                            type="number" step="0.5" placeholder="0"
                                            value={strengthDetails.weight}
                                            onChange={e => setStrengthDetails({...strengthDetails, weight: e.target.value})} 
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Powtórzenia</label>
                                        <input 
                                            type="number" placeholder="0"
                                            value={strengthDetails.repetitions}
                                            onChange={e => setStrengthDetails({...strengthDetails, repetitions: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.detailsGrid}>
                                <div className={styles.formGroup}>
                                    <label>Dystans (km)</label>
                                    <input 
                                        type="number" step="0.01" placeholder="0.00"
                                        value={runDetails.distance_km}
                                        onChange={e => setRunDetails({...runDetails, distance_km: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Czas biegu (HH:MM:SS)</label>
                                    <div className={styles.timeInputRow}>
                                        <input type="number" placeholder="HH" min="0" 
                                            value={runDetails.hours} onChange={e => setRunDetails({...runDetails, hours: e.target.value})} />
                                        <span>:</span>
                                        <input type="number" placeholder="MM" min="0" max="59" 
                                            value={runDetails.minutes} onChange={e => setRunDetails({...runDetails, minutes: e.target.value})} />
                                        <span>:</span>
                                        <input type="number" placeholder="SS" min="0" max="59" 
                                            value={runDetails.seconds} onChange={e => setRunDetails({...runDetails, seconds: e.target.value})} />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tętno (BPM)</label>
                                    <input 
                                        type="number" placeholder="0"
                                        value={runDetails.average_heart_rate}
                                        onChange={e => setRunDetails({...runDetails, average_heart_rate: e.target.value})} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className={styles.buttonPrimary} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Zapisywanie...' : 'Wyślij do FitLOG'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewTrainingPage;