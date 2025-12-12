// frontend-app/src/App.jsx
import React, { useState } from 'react';
import './App.css'; // GLÓWNE STYLE APLIKACJI I RESPONSIVE
import { FaUserCircle } from 'react-icons/fa'; 
import HamburgerMenu from './components/HamburgerMenu';
// import './components/AuthForms.css'; // Dodaj import, jeśli tu definiujesz style formularzy

// --- Symulowane Komponenty Stron (bez zmian) ---
const HomePage = () => (
    <div className="page-content">
        <h1>Gotowy do treningu? 🔥</h1>
        <p>Użyj menu (górny lewy róg), aby nawigować i zacząć zapisywać swoje postępy.</p>
        <p>Motywacja: **Sukces to suma małych wysiłków powtarzanych dzień po dniu.**</p>
    </div>
);
const NewTrainingPage = () => <div className="page-content"><h1>Zapisz Nowy Trening 📝</h1><p>Tutaj będzie zaawansowany formularz do wprowadzania ćwiczeń, serii, powtórzeń i ciężaru.</p></div>;
const MyTrainingsPage = () => <div className="page-content"><h1>Moje Treningi 💪</h1><p>Wszystkie Twoje zarejestrowane sesje treningowe. Sprawdź swoje postępy!</p></div>;
const StatsPage = () => <div className="page-content"><h1>Statystyki 📊</h1><p>Wizualizacja postępów: wykresy, rekordy życiowe i analiza objętości.</p></div>;

// --- Komponenty Modali (Używamy teraz klasy .auth-container) ---

const LoginModal = ({ onClose, switchToRegister, onLoginSuccess }) => (
    // Zmieniamy .auth-modal na .auth-container dla lepszej integracji z Twoim CSS
    <div className="auth-modal-wrapper"> 
        <div className="auth-container">
            <h2>Zaloguj się</h2>
            <form onSubmit={(e) => { 
                e.preventDefault(); 
                onLoginSuccess();
            }}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Wprowadź email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" placeholder="Wprowadź hasło" required />
                </div>
                <button type="submit" className="submit-button">Zaloguj</button>
            </form>
            <div className="switch-text">
                Nie masz konta? <span onClick={switchToRegister}>Zarejestruj się!</span>
            </div>
            <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
    </div>
);

const RegisterModal = ({ onClose, switchToLogin }) => (
    <div className="auth-modal-wrapper">
        <div className="auth-container">
            <h2>Rejestracja</h2>
            <form onSubmit={(e) => { 
                e.preventDefault(); 
                alert('Rejestracja zakończona pomyślnie! Teraz się zaloguj.');
                switchToLogin();
            }}>
                 <div className="form-group">
                    <label htmlFor="username">Nazwa użytkownika</label>
                    <input type="text" id="username" placeholder="Wprowadź nazwę" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Wprowadź email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło</label>
                    <input type="password" id="password" placeholder="Wprowadź hasło" required />
                </div>
                <button type="submit" className="submit-button">Zarejestruj</button>
            </form>
            <div className="switch-text">
                Masz już konto? <span onClick={switchToLogin}>Zaloguj się</span>
            </div>
            <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
    </div>
);

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authModal, setAuthModal] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setAuthModal(null);
        setCurrentView('new-training');
    };

    const navigateTo = (view) => {
        if (view === 'logout') {
            setIsLoggedIn(false);
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
    };

    const openAuthModal = (mode) => {
        setAuthModal(mode);
    };

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
    
    const switchToRegister = () => setAuthModal('register');
    const switchToLogin = () => setAuthModal('login');

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

            {/* Modale Autoryzacji są renderowane warunkowo */}
            {(authModal === 'login' || authModal === 'register') && <div className="auth-overlay"></div>}
            
            {authModal === 'login' && <LoginModal onClose={() => setAuthModal(null)} switchToRegister={switchToRegister} onLoginSuccess={handleLoginSuccess} />}
            {authModal === 'register' && <RegisterModal onClose={() => setAuthModal(null)} switchToLogin={switchToLogin} />}

            {/* DEBUG Button - pomaga testować stan logowania bez backendu */}
            <button 
                className="toggle-login-state-btn"
                onClick={() => {
                    setIsLoggedIn(!isLoggedIn);
                    setAuthModal(null);
                    if (isLoggedIn) setCurrentView('home');
                }}
            >
                {isLoggedIn ? 'DEBUG: Wyloguj' : 'DEBUG: Zaloguj'}
            </button>
        </div>
    );
}

export default App;