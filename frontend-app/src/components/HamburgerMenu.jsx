// frontend-app/src/components/HamburgerMenu.jsx

import React from 'react';
import { FaHome, FaRunning, FaDumbbell, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const HamburgerMenu = ({ isOpen, toggleMenu, isLoggedIn, navigateTo, openAuthModal }) => {
    // Funkcja nawigacji, która zamyka menu
    const handleNavigate = (view) => {
        navigateTo(view);
    };

    // Funkcja otwierająca modal (i zamykająca menu, jeśli było otwarte)
    const handleOpenAuthModal = (mode) => {
        openAuthModal(mode);
        if (isOpen) toggleMenu();
    };

    return (
        <>
            <button className="menu-toggle mobile-only-menu" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>FitLOG</h2>
                    <button className="close-btn" onClick={toggleMenu}><FaTimes /></button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <a onClick={() => handleNavigate('home')}>
                                <FaHome className="icon" />
                                <span>Główna</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleNavigate('new-training')}>
                                <FaRunning className="icon" />
                                <span>Zapisz Trening</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleNavigate('my-trainings')}>
                                <FaDumbbell className="icon" />
                                <span>Moje Treningi</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleNavigate('stats')}>
                                <FaUserCircle className="icon" />
                                <span>Statystyki</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    {isLoggedIn ? (
                        <a onClick={() => handleNavigate('logout')}>
                            <FaSignOutAlt className="icon" />
                            <span>Wyloguj</span>
                        </a>
                    ) : (
                        // Na desktopie ten link jest ukryty, ale logika jest zachowana.
                        <a onClick={() => handleOpenAuthModal('login')}>
                            <FaUserCircle className="icon" />
                            <span>Zaloguj / Rejestracja</span>
                        </a>
                    )}
                </div>
            </aside>
            
            {/* Overlay zaciemniający tło */}
            {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
        </>
    );
};

export default HamburgerMenu;