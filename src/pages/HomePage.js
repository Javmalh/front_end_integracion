// src/pages/HomePage.js
import React from 'react';
import ProductSlider from '../components/ProductSlider/ProductSlider'; // Importa el slider
import { Link } from 'react-router-dom'; // <--- IMPORTANTE: Importa Link
import './HomePage.css';

function HomePage() {
    return (
        <div className="home-page">
            {/* Sección de botones de Categorías y Ofertas */}
            <div className="secondary-nav">
                {/* CAMBIO: Usamos Link para navegar a la página de productos */}
                <Link to="/productos" className="nav-button-secondary">Productos</Link> {/* <--- BOTÓN MODIFICADO */}
                <button className="nav-button-secondary">Ofertas</button>
            </div>

            {/* Slider de productos */}
            <ProductSlider />

            {/* Para mantener el contenido existente de HomePage o adaptarlo */}
            <section className="hero-section">
                <h2>Bienvenido a FerreMax</h2>
                <p>Todo lo que necesitas para tus proyectos, grandes o pequeños.</p>
                {/* Opcional: También puedes hacer que este botón "Explorar Productos" navegue a /productos */}
                <Link to="/productos" className="btn-primary">Explorar Productos</Link>
            </section>

            <section className="featured-products">
                <h3>Productos Destacados</h3>
                <div className="product-grid">
                    <div className="product-card">
                        <h4>Taladro Percutor</h4>
                        <p>Potencia y precisión para cada tarea.</p>
                        <span className="price">$59.990</span>
                    </div>
                    <div className="product-card">
                        <h4>Set de Herramientas</h4>
                        <p>Indispensable para cualquier caja de herramientas.</p>
                        <span className="price">$34.990</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;