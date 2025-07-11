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

// Importaciones de páginas de pago
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

// Importaciones de páginas estáticas
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';


import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

// Importación para historial de transacciones (pagos)
import TransactionHistoryPage from './pages/TransactionHistoryPage';

// Importaciones para React-Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

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
    }, []);

    const shouldShowHeaderAndFooter = location.pathname !== '/login' &&
        location.pathname !== '/register';

    return (
        <CartProvider>
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

                        {/* Rutas de Pago */}
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/payment-failure" element={<PaymentFailurePage />} />

                        {/* Rutas Estáticas */}
                        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
                        <Route path="/terminos-condiciones" element={<TermsAndConditionsPage />} />

                        {/* --- RUTAS DE ÓRDENES Y HISTORIAL DE PAGOS --- */}
                        {isLoggedIn ? (
                            <>
                                <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
                                <Route path="/worker-inventory" element={<WorkerInventoryPage />} />
                                <Route path="/profile" element={<UserProfilePage onProfileUpdate={handleUserNameUpdate} />} />
                                <Route path="/settings" element={<AccountSettingsPage onProfileUpdate={handleUserNameUpdate} />} />

                                <Route path="/my-transactions" element={<TransactionHistoryPage />} />
                                <Route path="/my-orders" element={<MyOrdersPage />} />
                                <Route path="/my-orders/:id" element={<OrderDetailPage />} />
                            </>
                        ) : (
                            <>
                                {/* Rutas protegidas que redirigen a login si no está logueado */}
                                <Route path="/worker-dashboard" element={<RedirectToLogin />} />
                                <Route path="/worker-inventory" element={<RedirectToLogin />} />
                                <Route path="/profile" element={<RedirectToLogin />} />
                                <Route path="/settings" element={<RedirectToLogin />} />
                                <Route path="/my-transactions" element={<RedirectToLogin />} />
                                <Route path="/my-orders" element={<RedirectToLogin />} />
                                <Route path="/my-orders/:id" element={<RedirectToLogin />} />
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


function RedirectToLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [navigate]);
    return null;
}

export default App;