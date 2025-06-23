// src/main/js/src/components/Header/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider'; // Verifica esta ruta
import './Header.css';
import logo from '../../assets/ferremax-logo.png';
import sucursalesData from '../../data/sucursalesData';

function Header({ isLoggedIn, userName, onLogout, userRole }) {
    const { getTotalItems } = useCart();
    const navigate = useNavigate();

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSucursalName, setSelectedSucursalName] = useState('Sucursales');
    const [isSucursalesDropdownOpen, setIsSucursalesDropdownOpen] = useState(false);
    const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);

    const closeProfileDropdown = () => {
        setIsProfileDropdownOpen(false);
    };

    const closeManagementDropdown = () => {
        setIsManagementDropdownOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        closeProfileDropdown();
        closeManagementDropdown();
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
    };

    const handleSucursalClick = (sucursal) => {
        setSelectedSucursalName(sucursal.title);
        setIsSucursalesDropdownOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
            if (!event.target.closest('.sucursales-dropdown-container')) {
                setIsSucursalesDropdownOpen(false);
            }
            if (!event.target.closest('.management-dropdown-container')) {
                setIsManagementDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        {/* Botón de Sucursales con Dropdown */}
                        <li
                            className="sucursales-dropdown-container"
                            onMouseEnter={() => setIsSucursalesDropdownOpen(true)}
                            onMouseLeave={() => setIsSucursalesDropdownOpen(false)}
                        >
                            <button className="header-button-base nav-button sucursales-button">
                                {selectedSucursalName}
                            </button>
                            {isSucursalesDropdownOpen && (
                                <div className="sucursales-dropdown-menu">
                                    {sucursalesData.map(sucursal => (
                                        <Link
                                            key={sucursal.id}
                                            to="/"
                                            className="dropdown-item"
                                            onClick={() => handleSucursalClick(sucursal)}
                                        >
                                            {sucursal.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>

                        {isLoggedIn ? (
                            <>
                                {userRole === 'WORKER' ? (
                                    <>
                                        {/* Menú de Gestión para WORKER */}
                                        <li
                                            className="management-dropdown-container"
                                            onMouseEnter={() => setIsManagementDropdownOpen(true)}
                                            onMouseLeave={() => setIsManagementDropdownOpen(false)}
                                        >
                                            <button className="header-button-base nav-button management-button">
                                                Panel de Gestión
                                            </button>
                                            {isManagementDropdownOpen && (
                                                <div className="management-dropdown-menu">
                                                    <Link
                                                        to="/worker-dashboard"
                                                        className="dropdown-item"
                                                        onClick={closeManagementDropdown}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/worker-inventory"
                                                        className="dropdown-item"
                                                        onClick={closeManagementDropdown}
                                                    >
                                                        Ver Inventario
                                                    </Link>
                                                </div>
                                            )}
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        {/* Botón de Carrito para usuarios NO WORKER (clientes) */}
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

                                {/* ESTE ES EL BLOQUE DEL PERFIL/CERRAR SESIÓN. SE MUESTRA PARA TODOS LOS LOGUEADOS. */}
                                {/* Las opciones del desplegable variarán según el rol. */}
                                <li className="profile-dropdown-container"
                                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                                    onMouseLeave={() => setIsProfileDropdownOpen(false)}
                                >
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="header-button-base nav-button profile-dropdown-button"
                                    >
                                        {userName || 'Perfil'} {/* Muestra el nombre de usuario */}
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="profile-dropdown-menu">
                                            {userRole !== 'WORKER' && ( // Solo muestra Mis Datos y Cuenta si NO es WORKER
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        className="dropdown-item"
                                                        onClick={closeProfileDropdown}
                                                    >
                                                        Mis Datos
                                                    </Link>
                                                    <Link
                                                        to="/settings"
                                                        className="dropdown-item"
                                                        onClick={closeProfileDropdown}
                                                    >
                                                        Cuenta
                                                    </Link>
                                                </>
                                            )}
                                            {/* El botón de Cerrar Sesión SIEMPRE aparece para usuarios logueados en este menú */}
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-item logout-dropdown-item"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </li>
                            </>
                        ) : (
                            <>
                                {/* Opciones para usuarios no logueados */}
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