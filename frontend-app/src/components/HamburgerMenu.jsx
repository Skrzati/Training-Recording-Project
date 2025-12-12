// frontend-app/src/components/HamburgerMenu.jsx
import React from 'react';
import { FaHome, FaRunning, FaDumbbell, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

// Komponent Menu Hamburger
const HamburgerMenu = ({ isOpen, toggleMenu, isLoggedIn, navigateTo, openAuthModal }) => {
    return (
        <>
            {/* Ikona hamburgera/zamknięcia - widoczna tylko na małych ekranach */}
            <button className="menu-toggle mobile-only-menu" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Boczne Menu (Sidebar) */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>FitLOG</h2>
                    <button className="close-btn" onClick={toggleMenu}><FaTimes /></button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <a onClick={() => { navigateTo('home'); toggleMenu(); }}>
                                <FaHome className="icon" />
                                <span>Główna</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => { navigateTo('new-training'); toggleMenu(); }}>
                                <FaRunning className="icon" />
                                <span>Zapisz Trening</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => { navigateTo('my-trainings'); toggleMenu(); }}>
                                <FaDumbbell className="icon" />
                                <span>Moje Treningi</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => { navigateTo('stats'); toggleMenu(); }}>
                                <FaUserCircle className="icon" />
                                <span>Statystyki</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    {isLoggedIn ? (
                        <a onClick={() => { navigateTo('logout'); toggleMenu(); }}>
                            <FaSignOutAlt className="icon" />
                            <span>Wyloguj</span>
                        </a>
                    ) : (
                        <a onClick={() => { openAuthModal('login'); toggleMenu(); }}>
                            <FaUserCircle className="icon" />
                            <span>Zaloguj / Rejestracja</span>
                        </a>
                    )}
                </div>
            </aside>
            
            {/* Overlay zaciemniający tło - widoczny tylko gdy menu otwarte na małych ekranach */}
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default HamburgerMenu;