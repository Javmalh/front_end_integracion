// src/pages/ProductListPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import './ProductListPage.css';
import axios from 'axios';
// Importa el hook useCart desde tu contexto
import { useCart } from '../context/CartContext'; // <--- Importa useCart

function ProductListPage() {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState('');

    const location = useLocation();
    const { addItem } = useCart(); // <--- Accede a la función addItem del carrito

    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearchTermLocal = () => {
        setSearchTerm('');
    };

    const handleSucursalChange = (e) => {
        setSelectedSucursalId(parseInt(e.target.value));
    };

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sucursales'); // ¡Ajusta esta URL!
                console.log("Sucursales cargadas del backend:", response.data);
                setSucursales(response.data);
            } catch (err) {
                console.error("Error al cargar sucursales:", err);
            }
        };
        fetchSucursales();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const termFromUrl = params.get('search');
        if (termFromUrl) {
            setSearchTerm(termFromUrl);
        } else {
            setSearchTerm('');
        }
    }, [location.search]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                searchTerm: searchTerm,
                categories: selectedFilters.length > 0 ? selectedFilters.join(',') : undefined,
                sucursalId: selectedSucursalId || undefined // Esto aún se usa para filtrar productos si se selecciona
            };

            const response = await axios.get('http://localhost:8080/api/products', { // ¡Ajusta esta URL!
                params: params,
            });

            setProducts(response.data);

        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('Error al cargar los productos. Inténtalo de nuevo más tarde.');
            if (axios.isAxiosError(err) && err.response) {
                console.error('Detalles del error del backend:', err.response.data);
                setError(err.response.data.message || 'Error al cargar los productos desde el servidor.');
            }
        } finally {
            setLoading(false);
        }
    }, [selectedFilters, searchTerm, selectedSucursalId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const formatPriceCLP = (price) => {
        if (price == null) {
            return 'Precio no disponible';
        }
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(price);
    };

    // --- LÓGICA DE AÑADIR AL CARRITO SIN CHEQUEO DE SUCURSAL ---
    const handleAddToCart = (product) => {
        // Asignamos la primera sucursal cargada como la sucursal por defecto.
        // Asegúrate de que `sucursales` no esté vacío.
        const defaultBranch = sucursales[0];

        if (!defaultBranch) {
            // Este caso solo debería ocurrir si la carga de sucursales falla o no devuelve ninguna.
            alert('No hay sucursales disponibles para añadir este producto.');
            console.error("Error: No se encontró una sucursal por defecto para añadir el producto.");
            return;
        }

        // Llamamos a addItem con el producto y la sucursal por defecto
        addItem(product, defaultBranch, 1); // Añade 1 unidad por defecto
        alert(`${product.nombre} ha sido añadido al carrito en la sucursal ${defaultBranch.nombre}.`);
        console.log("Producto añadido:", product.nombre, "a sucursal:", defaultBranch.nombre);
    };
    // --- FIN LÓGICA DE AÑADIR AL CARRITO ---

    return (
        <div className="product-list-page-container">
            <FilterSidebar onFilterChange={handleFilterChange} />

            <div className="products-content">
                <h2>Nuestros Productos</h2>

                <div className="product-controls">
                    <div className="search-input-wrapper-local">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o descripción..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search-button-local"
                                onClick={clearSearchTermLocal}
                            >
                                &#x2715;
                            </button>
                        )}
                    </div>
                    {/* El selector de sucursales sigue presente si lo usas para FILTRAR PRODUCTOS */}
                    <select
                        value={selectedSucursalId}
                        onChange={handleSucursalChange}
                        className="sucursal-select"
                    >
                        <option value="">Todas las Sucursales</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <p className="loading-message">Cargando productos...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <p className="no-products-message">
                        {searchTerm ?
                            `No se encontraron productos que coincidan con "${searchTerm}".` :
                            'No se encontraron productos para los filtros seleccionados.'
                        }
                    </p>
                )}

                <div className="product-grid">
                    {!loading && !error && products.map(product => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.imagenUrl || 'https://via.placeholder.com/150?text=No+Imagen'}
                                alt={product.nombre || 'Producto sin nombre'}
                            />
                            <h3>{product.nombre || 'Producto sin nombre'}</h3>
                            <p>Categoría: {product.categoria || 'N/A'}</p>
                            <p className="price">
                                {formatPriceCLP(product.precio)}
                            </p>
                            <button
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(product)}
                                // ¡El botón ya NO está deshabilitado por la selección de sucursal!
                                // Podrías deshabilitarlo si `products` está vacío o si `loading` es true.
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductListPage;