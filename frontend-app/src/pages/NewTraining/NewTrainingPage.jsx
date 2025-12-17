import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../api/api'; // <--- Poprawiony import
import styles from './NewTrainingPage.module.css'; 

// ===================================================================
// KOMPONENT GŁÓWNY: NewTrainingPage
// ===================================================================

const NewTrainingPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState('strength');
    
    const initialFormData = {
        name: '',
        workout_date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        notes: '',
        details: [], 
    };
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Funkcja do pobierania kategorii
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // KLUCZOWA ZMIANA: Użycie isPublic = true dla publicznego endpointu kategorii
                const response = await fetchWithAuth('/workouts/categories', {}, true); 
                const fetchedCategories = Array.isArray(response) ? response : (response.rows || response);
                
                setCategories(fetchedCategories);
                
                if (fetchedCategories.length > 0) {
                    const defaultKey = fetchedCategories.find(c => c.category_key === 'strength')?.category_key || fetchedCategories[0].category_key;
                    setSelectedCategoryKey(defaultKey);
                    
                    const initialDetails = defaultKey === 'run' ? {} : [];
                    setFormData(prev => ({ 
                        ...prev, 
                        details: initialDetails 
                    }));
                }
            } catch (err) {
                console.error('Błąd pobierania kategorii:', err);
                setError(`Nie udało się załadować typów treningów: ${err.message}.`);
            }
        };
        fetchCategories();
    }, []); 

    // Obsługa zmiany podstawowych pól formularza
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'category_select') {
            setSelectedCategoryKey(value);
            setFormData(prev => ({ 
                ...prev, 
                details: value === 'strength' ? [] : (value === 'run' ? {} : null) 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // Obsługa wysłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (categories.length === 0) {
             return setError('Nie można zapisać. Nie załadowano kategorii treningu.');
        }

        const finalData = {
            ...formData,
            category_key: selectedCategoryKey,
            duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes, 10) : null
        };
        
        // Ręczna walidacja front-end (jak ustaliliśmy)
        if (selectedCategoryKey === 'strength') {
            if (!Array.isArray(finalData.details) || finalData.details.length === 0) {
                return setError('Trening siłowy wymaga dodania co najmniej jednej serii.');
            }
            finalData.details = finalData.details.map(item => ({
                ...item,
                repetitions: item.repetitions === '' ? null : item.repetitions,
                weight: item.weight === '' ? null : item.weight,
                exercise_name: item.exercise_name.trim()
            }));
            if (finalData.details.some(item => !item.exercise_name)) {
                return setError('Każda seria musi mieć podaną nazwę ćwiczenia.');
            }
        }
        if (selectedCategoryKey === 'run' && (!finalData.details || finalData.details.distance_km === '' || finalData.details.time_seconds === '')) {
            return setError('Trening biegowy wymaga podania dystansu i czasu w sekundach.');
        }

        try {
            // Wysłanie danych (POST, wymaga tokena - isPublic domyślnie false)
            await fetchWithAuth('/workouts', {
                 method: 'POST',
                 body: JSON.stringify(finalData)
            });
            
            setMessage('Trening zapisany pomyślnie!');
            
            setFormData(initialFormData);
            setFormData(prev => ({ 
                ...initialFormData,
                details: selectedCategoryKey === 'run' ? {} : []
            }));

        } catch (err) {
            const apiError = err.message || err.response?.data?.msg || 'Błąd zapisu treningu. Brak tokena autoryzacji?';
            setError(apiError);
            console.error('Błąd zapisu:', err);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <h2>Dodaj Nowy Trening</h2>
            
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}
            
            {categories.length > 0 && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="category_select">Typ Treningu:</label>
                        <select 
                            id="category_select"
                            name="category_select"
                            value={selectedCategoryKey}
                            onChange={handleChange}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_key}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Nazwa Treningu:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="workout_date">Data:</label>
                        <input type="date" id="workout_date" name="workout_date" value={formData.workout_date} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="duration_minutes">Czas trwania (minuty):</label>
                        <input type="number" id="duration_minutes" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} min="1" />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notatki:</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" />
                    </div>

                    <DynamicDetailsForm 
                        categoryKey={selectedCategoryKey} 
                        details={formData.details} 
                        setDetails={(newDetails) => setFormData(prev => ({ ...prev, details: newDetails }))}
                    />
                    
                    <button type="submit" className={styles.buttonPrimary}>Zapisz Trening</button>
                </form>
            )}
            {categories.length === 0 && !error && <p>Ładowanie formularza...</p>}
        </div>
    );
};


// ===================================================================
// KOMPONENTY POMOCNICZE (bez zmian)
// ===================================================================

const DynamicDetailsForm = ({ categoryKey, details, setDetails }) => {
    switch (categoryKey) {
        case 'run':
            return <RunDetailsForm details={details} setDetails={setDetails} />;
        case 'strength':
            return <StrengthDetailsForm details={details} setDetails={setDetails} />;
        default:
            return <p>Wybierz typ treningu, aby dodać szczegóły.</p>;
    }
}

// --- RunDetailsForm i StrengthDetailsForm - pozostają takie same ---

const RunDetailsForm = ({ details, setDetails }) => {
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if (['distance_km', 'time_seconds', 'max_heart_rate', 'average_heart_rate'].includes(name) && value !== '') {
            processedValue = parseFloat(value);
            if (isNaN(processedValue)) processedValue = value; 
        }

        setDetails(prev => ({ 
            ...prev, 
            [name]: processedValue 
        }));
    };

    return (
        <div className={styles.detailsSection}>
            <h3>Szczegóły Biegania</h3>
            <div className={styles.formGroup}>
                <label htmlFor="distance_km">Dystans (km):</label>
                <input type="number" id="distance_km" name="distance_km" value={details.distance_km || ''} onChange={handleDetailChange} step="0.01" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="time_seconds">Czas (sekundy):</label>
                <input type="number" id="time_seconds" name="time_seconds" value={details.time_seconds || ''} onChange={handleDetailChange} min="1" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="average_heart_rate">Średnie Tętno (opcjonalnie):</label>
                <input type="number" id="average_heart_rate" name="average_heart_rate" value={details.average_heart_rate || ''} onChange={handleDetailChange} min="1" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="max_heart_rate">Maksymalne Tętno (opcjonalnie):</label>
                <input type="number" id="max_heart_rate" name="max_heart_rate" value={details.max_heart_rate || ''} onChange={handleDetailChange} min="1" />
            </div>
        </div>
    );
};

const StrengthDetailsForm = ({ details, setDetails }) => {
    
    const addSet = () => {
        setDetails(prev => [
            ...prev,
            {
                exercise_name: '',
                set_number: prev.length + 1,
                repetitions: '',
                weight: '',
                unit: 'kg',
            }
        ]);
    };
    
    const removeSet = (indexToRemove) => {
        const newDetails = details
            .filter((_, index) => index !== indexToRemove)
            .map((item, index) => ({
                ...item,
                set_number: index + 1
            }));
        setDetails(newDetails);
    };

    const handleSetChange = (index, e) => {
        const { name, value } = e.target;
        const newDetails = details.map((item, i) => {
            if (i === index) {
                let processedValue = value;
                
                if ((name === 'repetitions' || name === 'weight') && value !== '') {
                    processedValue = parseFloat(value);
                    if (isNaN(processedValue)) {
                        processedValue = value; 
                    }
                }
                
                return {
                    ...item,
                    [name]: processedValue,
                };
            }
            return item;
        });
        setDetails(newDetails);
    };

    return (
        <div className={styles.detailsSection}>
            <h3>Szczegóły Treningu Siłowego (Seria)</h3>
            <p className={styles.note}>Wpisz nazwę ćwiczenia i dodawaj kolejne serie, ciężar jest opcjonalny.</p>
            
            {details.map((item, index) => (
                <div key={index} className={styles.setRow}>
                    <h4>Seria {item.set_number}</h4>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Ćwiczenie:</label>
                        <input 
                            type="text"
                            name="exercise_name"
                            value={item.exercise_name}
                            onChange={(e) => handleSetChange(index, e)}
                            placeholder="Np. Wyciskanie sztangi"
                            required
                        />
                    </div>
                    
                    <div className={`${styles.formGroup} ${styles.small}`}>
                        <label>Powtórzenia:</label>
                        <input
                            type="number"
                            name="repetitions"
                            value={item.repetitions}
                            onChange={(e) => handleSetChange(index, e)}
                            min="1"
                            placeholder="Powt."
                        />
                    </div>
                    <div className={`${styles.formGroup} ${styles.small}`}>
                        <label>Ciężar:</label>
                        <input
                            type="number"
                            name="weight"
                            value={item.weight}
                            onChange={(e) => handleSetChange(index, e)}
                            step="0.01"
                            placeholder="Ciężar"
                        />
                    </div>
                    <div className={`${styles.formGroup} ${styles.unit}`}>
                         <label>Jednostka:</label>
                         <select name="unit" value={item.unit} onChange={(e) => handleSetChange(index, e)}>
                            <option value="kg">kg</option>
                            <option value="lbs">lbs</option>
                            <option value="none">brak</option>
                         </select>
                    </div>

                    <button type="button" onClick={() => removeSet(index)} className={styles.buttonRemove}>Usuń Serię</button>
                </div>
            ))}

            <button type="button" onClick={addSet} className={styles.buttonSecondary}>
                + Dodaj Serię
            </button>
        </div>
    );
};


export default NewTrainingPage;