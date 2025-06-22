// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import Footer from "./components/Footer/Footer";
import { CartProvider } from './components/Cart/CartProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import Sucursales from "./pages/Sucursales";
// IMPORTA LA NUEVA VISTA
import ProductListPage from './pages/ProductListPage'; // Asegúrate que la ruta sea correcta

import './App.css';

function App() {
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

    const handleLogin = (token, name) => {
        setIsLoggedIn(true);
        setAccessToken(token);
        setUserName(name);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userName', name);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setAccessToken('');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        alert('¡Has cerrado sesión!');
    };

    useEffect(() => {
        // Tu lógica existente aquí si la tienes.
        // Por ejemplo, podrías verificar la validez del token aquí si caduca.
    }, []);

    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Header isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/sucursales" element={<Sucursales />} />
                            {/* ¡ESTA RUTA YA ESTÁ CORRECTAMENTE AÑADIDA Y ASOCIA /productos con ProductListPage! */}
                            <Route path="/productos" element={<ProductListPage />} />

                            <Route
                                path="/profile"
                                element={
                                    isLoggedIn ? (
                                        <UserProfilePage userName={userName} />
                                    ) : (
                                        <RedirectToLogin />
                                    )
                                }
                            />

                            {/* Ruta comodín para manejar cualquier otra URL no definida */}
                            <Route path="*" element={<h2>404: Página no encontrada</h2>} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

// Componente auxiliar para redirigir a login si el usuario no está logueado
function RedirectToLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        // Redirige después de que el componente se monte
        navigate('/login');
    }, [navigate]); // Dependencia 'navigate' asegura que se ejecuta si 'navigate' cambia (raro, pero buena práctica)
    return null; // Este componente no renderiza nada visible
}

export default App;