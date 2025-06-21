// src/components/Header/Header.js

import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import { useCart } from '../Cart/CartProvider'; // Importa tu hook useCart

import './Header.css'; // Asegúrate de que esta ruta sea correcta para tu Header.css
import logo from '../../assets/ferremax-logo.png';

// El componente Header ahora recibe las props isLoggedIn, userName, y onLogout
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
                            <Link to="/sucursales" className="nav-button">
                                Sucursales
                            </Link>
                        </li>
                        {/* Renderizado condicional basado en si el usuario está logeado */}
                        {isLoggedIn ? (
                            <>
                                {/* Si el usuario está logeado, muestra el enlace al perfil y el botón de cerrar sesión */}
                                <li>
                                    <Link to="/profile" className="nav-button">
                                        Hola, {userName.split(' ')[0]} {/* Muestra solo el primer nombre */}
                                    </Link>
                                </li>
                                <li>
                                    {/* Botón de cerrar sesión que llama a la función onLogout pasada como prop */}
                                    <button onClick={onLogout} className="nav-button logout-button">
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Si el usuario NO está logeado, muestra el enlace para iniciar sesión
                            <li>
                                <Link to="/login" className="nav-button">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        )}
                        <li>
                            {/* Usa el componente Link para navegar al carrito */}
                            <Link to="/cart" className="nav-button cart-button">
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
