import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../api/api.js';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // --- UŻYCIE authenticatedFetch ---
        // Token zostanie automatycznie dodany do nagłówka Authorization
        const response = await authenticatedFetch('/workouts'); 

        if (response.ok) {
          const data = await response.json();
          setWorkouts(data);
        } else {
          // Jeśli backend zwróci np. 401, błąd jest już zalogowany w api.js
          setError(`Failed to fetch workouts: ${response.statusText}`);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}. Proszę się zalogować ponownie.</div>;
  }

  return (
    <div>
      <h2>Twoje Treningi</h2>
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name} - {workout.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;