// src/components/Menu/HamburgerMenu.jsx (W PEŁNI DZIAŁAJĄCA WERSJA)

import React from 'react';
// !!! POPRAWIONY IMPORT IKON: Dodano FaBars i FaTachometerAlt !!!
import { 
    FaHome, 
    FaRunning, 
    FaChartBar, 
    FaSignOutAlt, 
    FaUserPlus, 
    FaSignInAlt, 
    FaTimes, 
    FaTachometerAlt,
    FaBars // <--- TA IKONA BYŁA BRAKUJĄCA
} from 'react-icons/fa';
import styles from './HamburgerMenu.module.css'; 

// Lista linków menu z logiką autoryzacji
const menuItems = [
    { name: 'Strona Główna', view: 'home', icon: FaHome, requiresAuth: 'optional' },
    { name: 'Dashboard', view: 'dashboard', icon: FaTachometerAlt, requiresAuth: true }, 
    { name: 'Nowy Trening', view: 'new-training', icon: FaRunning, requiresAuth: true },
    { name: 'Moje Treningi', view: 'my-trainings', icon: FaChartBar, requiresAuth: true },
    { name: 'Statystyki', view: 'stats', icon: FaChartBar, requiresAuth: true },
    
    // Linki Autoryzacji 
    { name: 'Rejestracja', view: 'register', icon: FaUserPlus, requiresAuth: false, isAuthAction: true },
    { name: 'Logowanie', view: 'login', icon: FaSignInAlt, requiresAuth: false, isAuthAction: true },
    { name: 'Wyloguj', view: 'logout', icon: FaSignOutAlt, requiresAuth: true, isAuthAction: true },
];

const HamburgerMenu = ({ isOpen, toggleMenu, isLoggedIn, navigateTo, openAuthModal }) => {
    // Używamy template literal do obsługi otwarcia/zamknięcia i dodajemy klasę z modułu
    const sidebarClass = `${styles.sidebar} ${isOpen ? styles.open : ''}`;

    return (
        <>
            <button className="menu-toggle" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <div className={sidebarClass}>
                <div className={styles.sidebarHeader}>
                    <h2>Menu</h2>
                </div>
                
                <nav className={styles.sidebarNav}>
                    {menuItems.map((item, index) => {
                        
                        // 1. Logika Decyzyjna: Czy link ma być wyświetlony?
                        const shouldDisplay = 
                            item.requiresAuth === 'optional' || 
                            (item.requiresAuth === true && isLoggedIn) || 
                            (item.requiresAuth === false && !isLoggedIn); 
                        
                        if (!shouldDisplay) return null;
                        
                        // 2. Logika Akcji: Czy to akcja autoryzacyjna?
                        const handleClick = () => {
                            if (item.isAuthAction && item.view !== 'logout') {
                                openAuthModal(item.view);
                            } else {
                                navigateTo(item.view);
                            }
                        };

                        return (
                            <a key={index} onClick={handleClick}>
                                {/* Użycie item.icon jako komponentu */}
                                <item.icon className={styles.icon} /> {item.name}
                            </a>
                        );
                    })}
                </nav>
                
                <div className={styles.sidebarFooter}>
                    {/* Miejsce na wersję lub inne info */}
                </div>
            </div>
            {/* Dodajemy tło, by zamknąć menu kliknięciem poza nim, gdy jest otwarte */}
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default HamburgerMenu;