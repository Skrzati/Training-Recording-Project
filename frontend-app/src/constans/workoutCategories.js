// Służy do wyświetlania opcji w <select>
export const WORKOUT_CATEGORIES = [
    { category_key: 'strength', category_name: 'Trening Siłowy' },
    { category_key: 'run', category_name: 'Bieganie' }
];

// Zwraca początkową strukturę pola "details" w zależności od wybranego typu
export const getInitialDetails = (key) => {
    switch (key) {
        case 'strength':
            return []; // Lista serii (exercise_name, repetitions, weight)
        case 'run':
            return { distance_km: '', time_seconds: '', average_heart_rate: '', max_heart_rate: '' };
        default:
            return null;
    }
};