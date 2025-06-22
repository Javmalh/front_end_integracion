import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/CartProvider';

import './Header.css';
import logo from '../../assets/ferremax-logo.png';
import sucursalesData from '../../data/sucursalesData'; // Importa los datos de las sucursales

function Header({ isLoggedIn, userName, onLogout, userRole }) {
    const { getTotalItems } = useCart();
    const navigate = useNavigate();

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para la sucursal seleccionada en el botón
    const [selectedSucursalName, setSelectedSucursalName] = useState('Sucursales');

    // Estado: Para controlar la visibilidad del menú de sucursales
    const [isSucursalesDropdownOpen, setIsSucursalesDropdownOpen] = useState(false);

    const closeProfileDropdown = () => {
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        closeProfileDropdown();
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
        setSelectedSucursalName(sucursal.title); // Actualiza el nombre de la sucursal en el botón
        setIsSucursalesDropdownOpen(false); // Cierra el dropdown inmediatamente
        navigate('/'); // Navega a la página de inicio (según tu implementación actual)
    };

    // Para cerrar los dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown-container')) {
                setIsProfileDropdownOpen(false);
            }
            if (!event.target.closest('.sucursales-dropdown-container')) {
                setIsSucursalesDropdownOpen(false);
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
                                        <li>
                                            <Link to="/cart" className="header-button-base cart-button">
                                                🛒 Carrito
                                                {getTotalItems() > 0 && (
                                                    <span className="cart-item-count">{getTotalItems()}</span>
                                                )}
                                            </Link>
                                        </li>
                                        <li className="profile-dropdown-container"
                                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <button
                                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                className="header-button-base nav-button profile-dropdown-button"
                                            >
                                                Perfil
                                            </button>
                                            {isProfileDropdownOpen && (
                                                <div className="profile-dropdown-menu">
                                                    <Link
                                                        to="/profile"
                                                        className="dropdown-item"
                                                        onClick={closeProfileDropdown}
                                                    >
                                                        Mis Datos
                                                    </Link>
                                                    {/* >>>>>>>>> NUEVA OPCIÓN 'CUENTA' AQUÍ <<<<<<<<< */}
                                                    <Link
                                                        to="/settings" // Ruta a la página de configuración de cuenta
                                                        className="dropdown-item"
                                                        onClick={closeProfileDropdown}
                                                    >
                                                        Cuenta
                                                    </Link>
                                                    {/* <<<<<<<<< FIN NUEVA OPCIÓN <<<<<<<<< */}
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