import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/ProductSlider/ProductSlider';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductosDestacados = async () => {
            try {
                // Haz la llamada a tu nuevo endpoint del backend para productos populares
                // Asegúrate de que esta URL coincida con la de tu backend (ej. http://localhost:8080)
                const response = await fetch('http://localhost:8080/api/products/popular?limit=8'); // Puedes ajustar el 'limit'

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProductosDestacados(data);
            } catch (err) {
                setError(err);
                console.error("Error al cargar productos destacados:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosDestacados();
    }, []); // El array vacío asegura que se ejecuta solo una vez al montar el componente

    /**
     * Función para formatear un número como moneda Peso Chileno (CLP).
     * Muestra el símbolo '$' y el separador de miles '.', sin decimales.
     * @param {number} price El valor numérico del precio.
     * @returns {string} El precio formateado como string (ej. "$1.234").
     */
    const formatPrice = (price) => {
        // 'es-CL' para español de Chile, asegura la convención local (separador de miles con punto).
        // 'CLP' para Peso Chileno.
        // minimumFractionDigits y maximumFractionDigits en 0 para no mostrar decimales, ya que CLP no los usa.
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="home-page">
            {/* Sección de botones de Categorías y Ofertas */}
            <div className="secondary-nav">
                <Link to="/productos" className="nav-button-secondary">Productos</Link>
                {/* Nota: El botón de "Ofertas" aún no tiene funcionalidad, podrías añadirla más adelante */}
                <button className="nav-button-secondary">Ofertas</button>
            </div>

            {/* Slider de productos */}
            <ProductSlider />

            {/* Sección de Bienvenida/Hero */}
            <section className="hero-section">
                <h2>Bienvenido a FerreMax</h2>
                <p>Todo lo que necesitas para tus proyectos, grandes o pequeños.</p>
                <Link to="/productos" className="btn-primary">Explorar Productos</Link>
            </section>

            {/* Sección de Productos Destacados (Ahora dinámicos) */}
            <section className="featured-products">
                <h3>Productos Destacados</h3>
                <div className="product-grid">
                    {loading ? (
                        <p>Cargando productos destacados...</p>
                    ) : error ? (
                        <p className="error-message">Error al cargar productos destacados: {error.message}</p>
                    ) : productosDestacados.length > 0 ? (
                        productosDestacados.map(product => (
                            <div key={product.id} className="product-card">
                                {/* Asegúrate de que product.imagenUrl exista y sea válido. Agregamos un fallback si es null/vacío. */}
                                <img
                                    src={product.imagenUrl || 'https://via.placeholder.com/150?text=No+Imagen'}
                                    alt={product.nombre}
                                    className="product-image"
                                />
                                <h4>{product.nombre}</h4>
                                <p>{product.descripcion}</p> {/* Puedes usar descripción o dejar solo nombre si es muy larga */}

                                {/* --- ¡CORRECCIÓN AQUÍ! Aplicando el formateo de precio --- */}
                                <span className="price">
                                    {formatPrice(product.precio)}
                                </span>
                                {/* Opcional: Botón para ver detalles del producto, que podría llevar a /productos/{id} */}
                                {/* <Link to={`/productos/${product.id}`} className="view-details-button">Ver Detalles</Link> */}
                            </div>
                        ))
                    ) : (
                        <p>No hay productos destacados disponibles en este momento. Realiza algunas búsquedas para verlos aquí.</p>
                    )}
                </div>
            </section>

            {/* Si tienes una sección "Acerca de nosotros" o similar, podrías añadirla aquí */}
            {/* <section className="about-us-section">
                <h2>Sobre FerreMax</h2>
                <p>...</p>
            </section> */}
        </div>
    );
}

export default HomePage;