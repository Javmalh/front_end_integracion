// src/components/Header/Header.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider';

import './Header.css';
import logo from '../../assets/ferremax-logo.png';

function Header({ isLoggedIn, userName, onLogout, userRole }) {
    const { getTotalItems } = useCart();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        closeDropdown();
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/productos');
        }
    };

    const clearSearchTerm = () => {
        setSearchTerm('');
        // Opcional: si quieres que al borrar el texto con la X
        // se haga una nueva búsqueda para mostrar todos los productos
        // puedes navegar de nuevo, pero esto recargaría la página si ya estás en /productos
        // navigate('/productos');
    };

    return (
        <header className="header">
            <div className="header-top">
                <div className="logo-section">
                    <Link to="/">
                        <img src={logo} alt="FerreMax Logo" className="logo" />
                    </Link>
                </div>

                <form className="search-bar" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search-button"
                                onClick={clearSearchTerm}
                            >
                                &#x2715;
                            </button>
                        )}
                    </div>
                    <button type="submit">Buscar</button>
                </form>

                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/sucursales" className="header-button-base nav-button">
                                Sucursales
                            </Link>
                        </li>

                        {isLoggedIn ? (
                            <>
                                {userRole === 'WORKER' ? (
                                    <>
                                        <li>
                                            <Link to="/worker-dashboard" className="header-button-base nav-button">
                                                Panel Trabajador
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={onLogout} className="header-button-base logout-button">
                                                Cerrar Sesión
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="profile-dropdown-container">
                                            <button
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="header-button-base nav-button profile-dropdown-button"
                                            >
                                                Perfil
                                            </button>
                                            <div className="profile-dropdown-menu">
                                                <Link
                                                    to="/profile"
                                                    className="dropdown-item"
                                                    onClick={closeDropdown}
                                                >
                                                    Mis Datos
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="dropdown-item logout-dropdown-item"
                                                >
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="/cart" className="header-button-base cart-button">
                                                🛒 Carrito
                                                {getTotalItems() > 0 && (
                                                    <span className="cart-item-count">{getTotalItems()}</span>
                                                )}
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="header-button-base nav-button">
                                        Iniciar Sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cart" className="header-button-base cart-button">
                                        🛒 Carrito
                                        {getTotalItems() > 0 && (
                                            <span className="cart-item-count">{getTotalItems()}</span>
                                        )}
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;