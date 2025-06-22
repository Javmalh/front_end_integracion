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
import WorkerDashboardPage from './pages/WorkerDashboardPage'; // <-- ¡IMPORTA LA NUEVA VISTA DEL TRABAJADOR!
import Sucursales from "./pages/Sucursales";
import ProductListPage from './pages/ProductListPage'; // Asegúrate que la ruta sea correcta

import './App.css';

function App() {
    // Estados inicializados desde localStorage para persistencia al recargar la página
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedToken = localStorage.getItem('jwtToken');
        return !!storedToken; // Convertir a booleano (true si hay token, false si no)
    });

    const [userName, setUserName] = useState(() => {
        return localStorage.getItem('userName') || '';
    });

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem('jwtToken') || '';
    });

    // Nuevo estado para el rol del usuario, por defecto 'USER'
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || 'USER';
    });

    // Función de login: ahora acepta token, nombre y rol
    const handleLogin = (token, name, role) => { // <-- ¡Añadido 'role'!
        setIsLoggedIn(true);
        setAccessToken(token);
        setUserName(name);
        setUserRole(role); // <-- Guarda el rol
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userRole', role); // <-- Guarda el rol en localStorage
    };

    // Función de logout: limpia el estado y localStorage
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setAccessToken('');
        setUserRole('USER'); // Restablece el rol a USER
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole'); // Limpia el rol de localStorage
        alert('¡Has cerrado sesión!');
    };

    // Efecto para inicializar el estado de login/rol al cargar la aplicación
    // Si ya usas los initializers de useState con localStorage, este useEffect podría ser más simple
    // o solo para lógica adicional si se necesita (ej. validación de token JWT)
    useEffect(() => {
        // La lógica de recuperación de localStorage ya está en los useState initializers,
        // pero puedes añadir validaciones o lógica de token aquí si es necesario.
    }, []);

    return (
        <CartProvider>
            <Router>
                <div className="App">
                    {/* Pasamos el estado de login, las funciones y el rol al Header */}
                    <Header
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        onLogout={handleLogout}
                        userRole={userRole} // <-- ¡Pasa el rol al Header!
                    />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            {/* Pasamos la función de login actualizada a LoginPage */}
                            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/sucursales" element={<Sucursales />} />
                            <Route path="/productos" element={<ProductListPage />} />

                            {/* Rutas condicionales basadas en el estado de login y el rol */}
                            {isLoggedIn ? (
                                // Si el usuario está logeado
                                <>
                                    {/* Ruta para el panel del trabajador (WorkerDashboardPage) */}
                                    <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
                                    {/* Ruta para el perfil del usuario normal (UserProfilePage) */}
                                    <Route path="/profile" element={<UserProfilePage userName={userName} />} />

                                    {/* Opcional: Redireccionar si un trabajador intenta ir a /profile o viceversa
                                        Esto puede hacerse con un componente que haga la verificación
                                        o con lógica más avanzada en el mismo componente renderizado.
                                        Por ahora, simplemente los mapeamos, y el Header guiará.
                                    */}
                                </>
                            ) : (
                                // Si el usuario NO está logeado, estas rutas redirigen a login
                                <>
                                    <Route path="/profile" element={<RedirectToLogin />} />
                                    <Route path="/worker-dashboard" element={<RedirectToLogin />} />
                                </>
                            )}

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
// Usa este componente como 'element' para las rutas protegidas si el usuario no está logeado
function RedirectToLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        // Redirige después de que el componente se monte
        navigate('/login');
    }, [navigate]);
    return null; // Este componente no renderiza nada visible
}

export default App;