// frontend-app/src/App.jsx (OSTATECZNA, CZYSTA I POPRAWIONA WERSJA)

import React, { useState, useEffect } from 'react'; // <--- ZAPEWNIAMY DOSTĘP DO useState I useEffect

import { FaUserCircle } from 'react-icons/fa';

// 1. Hooki i Context
import { useAuth } from './context/AuthContext'; // <--- ZAPEWNIAMY DOSTĘP DO useAuth

// 2. Komponenty UI
import HamburgerMenu from './components/Menu/HamburgerMenu'; 
import LoginForm from './components/Login/LoginForm'; 
import RegistrationForm from './components/Register/RegistrationForm'; 

// 3. Komponenty Stron (Pages)
import DashboardPage from './pages/Dashboard/DashboardPage'; // Dodany widok
import HomePage from './pages/HomePage/HomePage';
import NewTrainingPage from './pages/NewTraining/NewTrainingPage';
import MyTrainingsPage from './pages/MyTrainings/MyTrainingsPage';
import StatsPage from './pages/Stats/StatsPage';


function App() {
    // 1. STAN LOKALNY UI
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');

    // 2. STAN GLOBALNY (z Contextu)
    const { isLoggedIn, userToken, authModal, setAuthModal, handleLogout, handleLoginSuccess } = useAuth();
    
    // 3. EFEKT: Trwałość sesji i przekierowanie po załadowaniu
    useEffect(() => {
        // Jeśli jest zalogowany I widok to nadal 'home'
        if (isLoggedIn && currentView === 'home') {
            setCurrentView('dashboard'); 
        }
    }, [isLoggedIn, currentView]); 

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 4. LOGIKA ROUTINGU I OCHRONY WIDOKÓW
    const protectedViews = ['dashboard', 'new-training', 'my-trainings', 'stats'];

    const navigateTo = (view) => {
        setIsMenuOpen(false); 

        if (view === 'logout') {
            handleLogout(); 
            setCurrentView('home');
            return;
        } 
        
        // Jeśli widok jest chroniony i użytkownik nie jest zalogowany
        if (protectedViews.includes(view) && !isLoggedIn) {
            setAuthModal('login');
            return;
        }
        
        setCurrentView(view);
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardPage />; 
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

    // 5. RENDEROWANIE
    return (
        <div className="app-container">
            <header className="navbar">
                <HamburgerMenu
                    isOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                    isLoggedIn={isLoggedIn}
                    navigateTo={navigateTo}
                    openAuthModal={(mode) => setAuthModal(mode)}
                />
                <div className="logo">FitLOG</div>
                <button 
                    className={`profile-btn desktop-profile-only ${isLoggedIn ? 'logged-in' : ''}`}
                    onClick={() => isLoggedIn ? toggleMenu() : setAuthModal('login')}
                >
                    <FaUserCircle />
                </button>
            </header>

            <main className="content">
                {renderView()}
            </main>

            {/* Modale Autoryzacji */}
            {(authModal === 'login' || authModal === 'register') && (
                <>
                    <div className="auth-overlay"></div>
                    <div className="auth-modal-wrapper">
                        {authModal === 'login' && <LoginForm />} 
                        {authModal === 'register' && <RegistrationForm />} 
                    </div>
                </>
            )}

            {/* DEBUG Button */}
             <button 
                className="toggle-login-state-btn"
                onClick={() => {
                    if (!isLoggedIn) {
                        // Używamy handleLoginSuccess z contextu
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