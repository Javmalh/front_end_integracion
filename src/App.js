// src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Footer from "./components/Footer/Footer";
import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';
import Sucursales from "./pages/Sucursales";
import ProductListPage from './pages/ProductListPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import WorkerInventoryPage from './pages/WorkerInventoryPage';

// --- ¡NUEVAS IMPORTACIONES PARA PÁGINAS DE PAGO! ---
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

// --- IMPORTACIONES PARA REACT-TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Estilos CSS de Toastify

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
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedToken = localStorage.getItem('jwtToken');
        return !!storedToken;
    });

    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('userName') || '';
    });

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('jwtToken') || '';
    });

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || 'USER';
    });

    const handleUserNameUpdate = (newName) => {
        setUserName(newName);
        localStorage.setItem('userName', newName);
    };

    const handleLogin = (token, name, role) => {
        setIsLoggedIn(true);
        setAccessToken(token);
        setUserName(name);
        setUserRole(role);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role);
        toast.success(`¡Bienvenido, ${name}!`);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setAccessToken('');
        setUserRole('USER');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        toast.info('¡Has cerrado sesión!');
        navigate('/login');
    };

    useEffect(() => {
        // La lógica de recuperación de localStorage ya está en los useState initializers
    }, []);

    const shouldShowHeaderAndFooter = location.pathname !== '/login' &&
        location.pathname !== '/register';

    return (
        <CartProvider>
            {/* --- CONTENEDOR DE TOASTIFY --- */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <ScrollToTop />
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

                        {/* --- ¡NUEVAS RUTAS PARA PÁGINAS DE PAGO! --- */}
                        {/* Estas rutas no necesitan protección inicial, ya que Transbank las redirige */}
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/payment-failure" element={<PaymentFailurePage />} />

                        {isLoggedIn ? (
                            <>
                                <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
                                <Route path="/worker-inventory" element={<WorkerInventoryPage />} />
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
                            <>
                                <Route path="/profile" element={<RedirectToLogin />} />
                                <Route path="/worker-dashboard" element={<RedirectToLogin />} />
                                <Route path="/worker-inventory" element={<RedirectToLogin />} />
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