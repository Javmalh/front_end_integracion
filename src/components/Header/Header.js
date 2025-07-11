import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';
import logo from '../../assets/ferremax-logo.png';
// sucursalesData se eliminará si se carga dinámicamente en el header o ya no se usa
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
                                {userRole === 'WORKER' || userRole === 'ADMIN' ? (
                                    <>
                                        {}
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
                                        {}
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

                                {}
                                <li className="profile-dropdown-container"
                                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                                    onMouseLeave={() => setIsProfileDropdownOpen(false)}
                                >
                                    <button
                                        className="header-button-base nav-button profile-dropdown-button"
                                    >
                                        {userName || 'Perfil'}
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="profile-dropdown-menu">
                                            {userRole !== 'WORKER' && userRole !== 'ADMIN' && (
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
                                            <Link
                                                to="/my-transactions"
                                                className="dropdown-item"
                                                onClick={closeProfileDropdown}
                                            >
                                                Mis Pagos
                                            </Link>
                                            {}
                                            <Link
                                                to="/my-orders"
                                                className="dropdown-item"
                                                onClick={closeProfileDropdown}
                                            >
                                                Mis Órdenes
                                            </Link>
                                            {}
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
                                {}
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