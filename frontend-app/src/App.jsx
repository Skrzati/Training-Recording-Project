// frontend-app/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Używa ujednoliconych stylów z blur i smaczkami
import { FaUserCircle } from 'react-icons/fa';
import HamburgerMenu from './components/HamburgerMenu';
import LoginForm from './components/LoginForm'; // Importujemy nowy komponent
import RegistrationForm from './components/RegistrationForm'; // Importujemy nowy komponent


// --- Symulowane Komponenty Stron (bez zmian) ---
const HomePage = () => (
    <div className="page-content">
        <h1>Gotowy do treningu? 🔥</h1>
        <p>Użyj menu (górny lewy róg) lub kliknij ikonę profilu, aby się zalogować i zacząć zapisywać swoje postępy.</p>
        <p>Motywacja: **Sukces to suma małych wysiłków powtarzanych dzień po dniu.**</p>
    </div>
);
const NewTrainingPage = () => <div className="page-content"><h1>Zapisz Nowy Trening 📝</h1><p>Tutaj będzie zaawansowany formularz do wprowadzania ćwiczeń, serii, powtórzeń i ciężaru.</p></div>;
const MyTrainingsPage = () => <div className="page-content"><h1>Moje Treningi 💪</h1><p>Wszystkie Twoje zarejestrowane sesje treningowe. Sprawdź swoje postępy!</p></div>;
const StatsPage = () => <div className="page-content"><h1>Statystyki 📊</h1><p>Wizualizacja postępów: wykresy, rekordy życiowe i analiza objętości.</p></div>;


function App() {
    // Stan logowania i tokena
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userToken, setUserToken] = useState(null); 

    // Stan UI
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [authModal, setAuthModal] = useState(null); // 'login', 'register', lub null

    // Ładowanie tokena z localStorage przy starcie (dla trwałości sesji)
    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        if (storedToken) {
            setUserToken(storedToken);
            setIsLoggedIn(true);
            setCurrentView('new-training'); // Przekieruj na główną stronę aplikacji po odświeżeniu
        }
    }, []);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * Obsługa udanego logowania. Przechowuje token i aktualizuje stan.
     * @param {string} token - Token JWT/sesji otrzymany z backendu.
     */
    const handleLoginSuccess = (token) => {
        setIsLoggedIn(true);
        setUserToken(token);
        localStorage.setItem('userToken', token); // Zapis tokena
        setAuthModal(null);
        setCurrentView('new-training'); 
    };

    const navigateTo = (view) => {
        if (view === 'logout') {
            setIsLoggedIn(false);
            setUserToken(null);
            localStorage.removeItem('userToken'); // Usuwamy token z Local Storage
            setCurrentView('home');
        } else if (['new-training', 'my-trainings', 'stats'].includes(view)) {
            if (!isLoggedIn) {
                setAuthModal('login'); 
            } else {
                setCurrentView(view);
            }
        } else {
            setCurrentView(view);
        }
        setIsMenuOpen(false); 
    };

    const openAuthModal = (mode) => {
        setAuthModal(mode);
    };
    
    // Funkcje do przełączania się między modalem
    const switchToRegister = () => setAuthModal('register');
    const switchToLogin = () => setAuthModal('login');


    const renderView = () => {
        switch (currentView) {
            case 'new-training':
                return <NewTrainingPage />;
            case 'my-trainings':
                return <MyTrainingsPage />;
            case 'stats':
                return <StatsPage />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="app-container">
            <header className="navbar">
                <HamburgerMenu
                    isOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                    isLoggedIn={isLoggedIn}
                    navigateTo={navigateTo}
                    openAuthModal={openAuthModal}
                />
                <div className="logo">FitLOG</div>
                <button 
                    className={`profile-btn desktop-profile-only ${isLoggedIn ? 'logged-in' : ''}`}
                    onClick={() => isLoggedIn ? toggleMenu() : openAuthModal('login')}
                >
                    <FaUserCircle />
                </button>
            </header>

            <main className="content">
                {renderView()}
            </main>

            {/* Modale Autoryzacji są renderowane warunkowo w wrapperze dla centrowania i blur */}
            {(authModal === 'login' || authModal === 'register') && (
                <>
                    {/* Nakładka z efektem BLUR */}
                    <div className="auth-overlay"></div>
                    <div className="auth-modal-wrapper">
                        {authModal === 'login' && <LoginForm 
                            onClose={() => setAuthModal(null)} 
                            switchToRegister={switchToRegister} 
                            onLoginSuccess={handleLoginSuccess}
                        />}
                        {authModal === 'register' && <RegistrationForm 
                            onClose={() => setAuthModal(null)} 
                            switchToLogin={switchToLogin}
                        />}
                    </div>
                </>
            )}

            {/* DEBUG Button - pomaga testować stan logowania bez backendu */}
            <button 
                className="toggle-login-state-btn"
                onClick={() => {
                    if (!isLoggedIn) {
                        // Symulacja udanego logowania i zapis tokena
                        handleLoginSuccess('DEBUG_TOKEN_123');
                    } else {
                        navigateTo('logout');
                    }
                }}
            >
                {isLoggedIn ? `DEBUG: Wyloguj (${userToken ? userToken.substring(0, 10) : 'brak'})` : 'DEBUG: Zaloguj'}
            </button>
        </div>
    );
}

export default App;