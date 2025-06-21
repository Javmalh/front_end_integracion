// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa los componentes de React Router DOM
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage'; // Importa tu componente CartPage
import Footer from "./components/Footer/Footer";
import { CartProvider } from './components/Cart/CartProvider'; // Asegúrate de importar tu CartProvider
import LoginPage from './pages/LoginPage'; // <-- ¡Importa tu LoginPage!
import RegisterPage from './pages/RegisterPage'; // <-- ¡Importa RegisterPage!
import './App.css';
import Sucursales from "./pages/Sucursales";

function App() {
    return (
        // Envuelve toda tu aplicación con CartProvider para que el contexto esté disponible globalmente
        <CartProvider>
            {/* BrowserRouter (o Router) envuelve toda la aplicación para habilitar el enrutamiento */}
            <Router>
                <div className="App">
                    <Header /> {/* El Header se mostrará en todas las rutas */}
                    <main>
                        {/* Routes define los diferentes caminos de tu aplicación */}
                        <Routes>
                            {/* Route para la página de inicio (ruta raíz) */}
                            <Route path="/" element={<HomePage />} />

                            {/* Route para la página del carrito */}
                            <Route path="/cart" element={<CartPage />} />

                            {/* Route para la página de inicio de sesión */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Route para la página de registro */}
                            <Route path="/register" element={<RegisterPage />} /> {/* <-- ¡Nueva ruta para RegisterPage! */}

                            {/* Route para la página de sucursales */}
                            <Route path="/sucursales" element={<Sucursales />} />

                            {/* Puedes añadir más rutas aquí para otras páginas, por ejemplo: */}
                            {/* <Route path="/productos" element={<ProductListPage />} /> */}
                            {/* <Route path="/sucursales" element={<BranchesPage />} /> */}

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
