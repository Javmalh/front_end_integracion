// src/App.js

import React, { useState } from 'react'; // Importa useState para gestionar el estado de login
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage'; // Importa tu componente CartPage
import Footer from "./components/Footer/Footer";
import { CartProvider } from './components/Cart/CartProvider'; // Asegúrate de importar tu CartProvider
import LoginPage from './pages/LoginPage'; // Importa tu LoginPage
import RegisterPage from './pages/RegisterPage'; // Importa RegisterPage
import UserProfilePage from './pages/UserProfilePage'; // <-- ¡Importa tu UserProfilePage!
import Sucursales from "./pages/Sucursales";
import './App.css';

function App() {
    // Estado para simular si el usuario está logeado y su nombre
    // En una aplicación real, este estado se gestionaría de forma más robusta (ej. con Context API, Redux, Zustand)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('John Doe'); // Nombre de usuario de ejemplo

    // Función para simular el inicio de sesión
    const handleLogin = (email, password) => {
        // Aquí iría tu lógica real de autenticación con el backend.
        // Por ahora, es un ejemplo simple con credenciales fijas.
        console.log(`Simulando login con email: ${email} y password: ${password}`);
        if (email === 'test@example.com' && password === 'password') { // Credenciales de ejemplo
            setIsLoggedIn(true);
            setUserName('Juan Pérez'); // Asigna un nombre de usuario de ejemplo al logearse
            alert('¡Inicio de sesión exitoso!');
            return true; // Indica que el login fue exitoso
        } else {
            alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
            return false; // Indica que el login falló
        }
    };

    // Función para simular el cierre de sesión
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        alert('¡Has cerrado sesión!');
        // Podrías redirigir al usuario a la página de inicio o login aquí si lo deseas
        // Nota: Si usas `navigate` aquí, necesitarías que `handleLogout` fuera un hook o que `App` tuviera acceso a `useNavigate`
    };

    return (
        // Envuelve toda tu aplicación con CartProvider para que el contexto esté disponible globalmente
        <CartProvider>
            {/* BrowserRouter (o Router) envuelve toda la aplicación para habilitar el enrutamiento */}
            <Router>
                <div className="App">
                    {/* El Header se mostrará en todas las rutas.
                        Le pasamos el estado de login y la función de logout. */}
                    <Header isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
                    <main>
                        {/* Routes define los diferentes caminos de tu aplicación */}
                        <Routes>
                            {/* Route para la página de inicio (ruta raíz) */}
                            <Route path="/" element={<HomePage />} />

                            {/* Route para la página del carrito */}
                            <Route path="/cart" element={<CartPage />} />

                            {/* Route para la página de inicio de sesión.
                                Le pasamos la función de login. */}
                            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                            {/* Route para la página de registro */}
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Route para la página de sucursales */}
                            <Route path="/sucursales" element={<Sucursales />} />

                            {/* Ruta para la página del perfil del usuario.
                                Renderiza UserProfilePage solo si isLoggedIn es true.
                                Si no está logeado, redirige a LoginPage. */}
                            {isLoggedIn ? (
                                <Route path="/profile" element={<UserProfilePage userName={userName} />} />
                            ) : (
                                <Route path="/profile" element={<LoginPage onLogin={handleLogin} />} />
                            )}

                            {/* Puedes añadir más rutas aquí para otras páginas */}
                            {/* <Route path="/productos" element={<ProductListPage />} /> */}

                            {/* Opcional: Ruta para manejar páginas no encontradas (404) */}
                            <Route path="*" element={<h2>404: Página no encontrada</h2>} />
                        </Routes>
                    </main>
                    <Footer /> {/* El Footer también se mostrará en todas las rutas */}
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
