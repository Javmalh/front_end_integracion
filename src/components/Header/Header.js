// src/components/Header/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider';

import './Header.css'; // Asegúrate de que esta ruta sea correcta para tu Header.css
import logo from '../../assets/ferremax-logo.png';

// El componente Header recibe las props isLoggedIn, userName, y onLogout
function Header({ isLoggedIn, userName, onLogout }) {
    const { getTotalItems } = useCart(); // Obtén la función para el total de ítems del carrito

    return (
        <header className="header">
            <div className="header-top">
                <div className="logo-section">
                    {/* El logo también puede ser un Link a la página principal */}
                    <Link to="/">
                        <img src={logo} alt="FerreMax Logo" className="logo" />
                    </Link>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Buscar productos por nombre o ID..." />
                    <button type="submit">Buscar</button>
                </div>

                <nav className="main-nav">
                    <ul>
                        <li>
                            {/* Aplicamos header-button-base y nav-button */}
                            <Link to="/sucursales" className="header-button-base nav-button">
                                Sucursales
                            </Link>
                        </li>
                        {/* Renderizado condicional basado en si el usuario está logeado */}
                        {isLoggedIn ? (
                            <>
                                <li>
                                    {/* Aplicamos header-button-base y nav-button */}
                                    <Link to="/profile" className="header-button-base nav-button">
                                        Hola, {userName.split(' ')[0]} {/* Muestra solo el primer nombre */}
                                    </Link>
                                </li>
                                <li>
                                    {/* Aplicamos header-button-base y logout-button */}
                                    <button onClick={onLogout} className="header-button-base logout-button">
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Si el usuario NO está logeado, muestra el enlace para iniciar sesión
                            <li>
                                {/* Aplicamos header-button-base y nav-button */}
                                <Link to="/login" className="header-button-base nav-button">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        )}
                        <li>
                            {/* Aplicamos header-button-base y cart-button */}
                            <Link to="/cart" className="header-button-base cart-button">
                                🛒 Carrito
                                {/* Muestra la cantidad de ítems si es mayor a 0 */}
                                {getTotalItems() > 0 && (
                                    <span className="cart-item-count">{getTotalItems()}</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;