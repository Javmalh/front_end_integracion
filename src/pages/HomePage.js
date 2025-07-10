import React, { useState, useEffect } from 'react';
import ProductSlider from '../components/ProductSlider/ProductSlider';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { getProducts } from '../services/api'; // Importamos getProducts de api.js

function HomePage() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductosDestacados = async () => {
            try {
                // Utiliza la función getProducts con los parámetros necesarios para popularidad
                // El backend maneja la lógica de popularidad, por lo que aquí solo la llamamos.
                const response = await getProducts({ limit: 8 }); // getProducts ya sabe cómo pedir populares

                if (!response.data) { // getProducts devuelve data en response.data
                    throw new Error(`Error: No se recibieron datos de productos populares.`);
                }
                setProductosDestacados(response.data);
            } catch (err) {
                setError(err);
                console.error("Error al cargar productos destacados:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosDestacados();
    }, []);

    const formatPrice = (price) => {
        if (price == null) {
            return 'Precio no disponible';
        }
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="home-page">
            <div className="secondary-nav">
                <Link to="/productos" className="nav-button-secondary">Productos</Link>
                <button className="nav-button-secondary">Ofertas</button>
            </div>

            <ProductSlider />

            <section className="hero-section">
                <h2>Bienvenido a FerreMax</h2>
                <p>Todo lo que necesitas para tus proyectos, grandes o pequeños.</p>
                <Link to="/productos" className="btn-primary">Explorar Productos</Link>
            </section>

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
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/150?text=No+Imagen'}
                                    alt={product.nombre}
                                    className="product-image"
                                />
                                <h4>{product.nombre}</h4>
                                <p>{product.descripcion}</p>

                                <span className="price">
                                    {formatPrice(product.precio)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>No hay productos destacados disponibles en este momento. Realiza algunas búsquedas para verlos aquí.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default HomePage;