import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Footer from "./components/Footer/Footer";
import { CartProvider } from './components/Cart/CartProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';
import Sucursales from "./pages/Sucursales";
import ProductListPage from './pages/ProductListPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

import './App.css';

// Componente para hacer scroll al top en cada cambio de ruta
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    const location = useLocation();

    // Estado para verificar si el usuario está logueado, inicializado desde localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedToken = localStorage.getItem('jwtToken');
        return !!storedToken; // Convertir a booleano
    });

    // Estado para el nombre de usuario, inicializado desde localStorage
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('userName') || '';
    });

    // Estado para el token de acceso, inicializado desde localStorage
    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('jwtToken') || '';
    });

    // Estado para el rol del usuario, inicializado desde localStorage
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || 'USER';
    });

    // Función para actualizar el userName globalmente (llamada desde UserProfilePage o AccountSettingsPage)
    const handleUserNameUpdate = (newName) => {
        setUserName(newName);
        localStorage.setItem('userName', newName); // Actualiza también en localStorage
    };

    // Función para manejar el login
    const handleLogin = (token, name, role) => {
        setIsLoggedIn(true);
        setAccessToken(token);
        setUserName(name);
        setUserRole(role);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
    };

    // Función para manejar el logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setAccessToken('');
        setUserRole('USER');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        alert('¡Has cerrado sesión!'); // O puedes usar un toast/notificación
    };

    useEffect(() => {
        // La lógica de recuperación de localStorage ya está en los useState initializers
        // Este useEffect podría usarse para otras inicializaciones o verificaciones al montar App.
    }, []);

    // Determina si el header y el footer deben mostrarse según la ruta actual
    const shouldShowHeaderAndFooter = location.pathname !== '/login' &&
        location.pathname !== '/register';

    return (
        <CartProvider>
            <ScrollToTop /> {/* Asegura que la página se desplace al inicio en cada cambio de ruta */}
            <div className="App">
                {shouldShowHeaderAndFooter && (
                    <Header
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        onLogout={handleLogout}
                        userRole={userRole}
                    />
                )}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/sucursales" element={<Sucursales />} />
                        <Route path="/productos" element={<ProductListPage />} />

                        {/* Rutas protegidas que solo son accesibles si el usuario está logueado */}
                        {isLoggedIn ? (
                            <>
                                <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
                                {/* Se pasa la función onProfileUpdate a los componentes de perfil y configuración */}
                                <Route
                                    path="/profile"
                                    element={<UserProfilePage onProfileUpdate={handleUserNameUpdate} />}
                                />
                                <Route
                                    path="/settings"
                                    element={<AccountSettingsPage onProfileUpdate={handleUserNameUpdate} />}
                                />
                            </>
                        ) : (
                            // Si no está logueado, redirige a la página de login para estas rutas
                            <>
                                <Route path="/profile" element={<RedirectToLogin />} />
                                <Route path="/worker-dashboard" element={<RedirectToLogin />} />
                                <Route path="/settings" element={<RedirectToLogin />} />
                            </>
                        )}

                        <Route path="*" element={<h2>404: Página no encontrada</h2>} />
                    </Routes>
                </main>
                {shouldShowHeaderAndFooter && <Footer />}
            </div>
        </CartProvider>
    );
}

// Componente auxiliar para redirigir a login si el usuario no está logueado
function RedirectToLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [navigate]);
    return null;
}

export default App;