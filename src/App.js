// src/App.js

import React, { useState, useEffect } from 'react'; // Importa useState y useEffect para gestionar el estado de login y efectos secundarios
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección programática
import Header from './components/Header/Header'; // Importa el componente Header
import HomePage from './pages/HomePage'; // Importa tu componente HomePage
import CartPage from './pages/CartPage'; // Importa tu componente CartPage
import Footer from "./components/Footer/Footer"; // Importa tu componente Footer
import { CartProvider } from './components/Cart/CartProvider'; // Asegúrate de importar tu CartProvider
import LoginPage from './pages/LoginPage'; // Importa tu LoginPage
import RegisterPage from './pages/RegisterPage'; // Importa RegisterPage
import UserProfilePage from './pages/UserProfilePage'; // Importa tu UserProfilePage
import Sucursales from "./pages/Sucursales"; // Importa tu componente Sucursales
import './App.css'; // Importa tu CSS global para App

function App() {
    // Estado para simular si el usuario está logeado, su nombre y el token de acceso
    // En una aplicación real, este estado se gestionaría de forma más robusta (ej. con Context API, Redux, Zustand)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState(''); // Inicializado vacío, se llena al logearse
    const [accessToken, setAccessToken] = useState(''); // Estado para almacenar el token JWT

    // Función para manejar el inicio de sesión exitoso
    // Recibe el token y el nombre de usuario del LoginPage después de la llamada al backend
    const handleLogin = (token, name) => {
        setIsLoggedIn(true);
        setAccessToken(token); // Guarda el token en el estado
        setUserName(name); // Guarda el nombre de usuario en el estado
        // Opcional pero recomendado: Guarda el token y nombre en localStorage para persistencia
        // Esto permite que el usuario permanezca logeado incluso después de cerrar el navegador
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userName', name);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        setAccessToken('');
        // Limpia el token y el nombre de usuario del almacenamiento local al cerrar sesión
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        alert('¡Has cerrado sesión!'); // Notifica al usuario
        // Nota: La redirección a /login después del logout puede ser manejada por el Header
        // o por el componente UserProfilePage, o podrías forzarla aquí si lo deseas.
    };

    // Efecto para verificar el estado de login al cargar la aplicación
    // Intenta recuperar el token y el nombre de usuario del localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUserName = localStorage.getItem('userName');
        if (storedToken && storedUserName) {
            setIsLoggedIn(true);
            setAccessToken(storedToken);
            setUserName(storedUserName);
        }
    }, []); // El array vacío de dependencias asegura que este efecto se ejecute solo una vez al montar el componente

    return (
        // Envuelve toda tu aplicación con CartProvider para que el contexto esté disponible globalmente
        <CartProvider>
            {/* BrowserRouter (o Router) envuelve toda la aplicación para habilitar el enrutamiento basado en URL */}
            <Router>
                <div className="App">
                    {/* El Header se mostrará en todas las rutas.
                        Le pasamos el estado de login (isLoggedIn, userName) y la función de logout. */}
                    <Header isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
                    <main>
                        {/* Routes define los diferentes caminos de tu aplicación y qué componente renderizar para cada uno */}
                        <Routes>
                            {/* Ruta para la página de inicio (ruta raíz) */}
                            <Route path="/" element={<HomePage />} />

                            {/* Ruta para la página del carrito */}
                            <Route path="/cart" element={<CartPage />} />

                            {/* Ruta para la página de inicio de sesión.
                                Le pasamos la función `handleLogin` para que pueda actualizar el estado de la app. */}
                            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                            {/* Ruta para la página de registro */}
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Ruta para la página de sucursales */}
                            <Route path="/sucursales" element={<Sucursales />} />

                            {/* Ruta para la página del perfil del usuario.
                                Renderiza UserProfilePage solo si isLoggedIn es true.
                                Si no está logeado, redirige a LoginPage para forzar el inicio de sesión. */}
                            {isLoggedIn ? (
                                <Route path="/profile" element={<UserProfilePage userName={userName} />} />
                            ) : (
                                <Route path="/profile" element={<LoginPage onLogin={handleLogin} />} />
                            )}

                            {/* Puedes añadir más rutas aquí para otras páginas de tu aplicación */}
                            {/* <Route path="/productos" element={<ProductListPage />} /> */}

                            {/* Ruta comodín para manejar páginas no encontradas (404) */}
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
