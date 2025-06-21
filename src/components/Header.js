import React from 'react';
import './Header.css';
import logo from '../assets/ferremax-logo.png';

function Header() {
    return (
        <header className="header">
            <div className="header-top">
                <div className="logo-section">
                    <img src={logo} alt="FerreMax Logo" className="logo" />
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Buscar productos por nombre o ID..." />
                    <button type="submit">Buscar</button>
                </div>

                <nav className="main-nav">
                    <ul>
                        <li><button className="nav-button">Sucursales</button></li>
                        <li><button className="nav-button">Iniciar Sesión</button></li>
                        <li><button className="nav-button cart-button">🛒 Carrito</button></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;