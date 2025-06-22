// src/pages/ProductListPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import './ProductListPage.css';
import axios from 'axios';

function ProductListPage() {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda local
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState('');

    const location = useLocation();

    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearchTermLocal = () => {
        setSearchTerm('');
        // Al borrar el campo de búsqueda localmente, la llamada a la API
        // se disparará automáticamente debido a la dependencia `searchTerm`
        // en el `fetchProducts` y `useEffect`. No es necesario navegar.
    };

    const handleSucursalChange = (e) => {
        setSelectedSucursalId(e.target.value);
    };

    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sucursales'); // Ajusta esta URL
                setSucursales(response.data);
            } catch (err) {
                console.error("Error al cargar sucursales:", err);
            }
        };
        fetchSucursales();
    }, []);

    // NUEVO useEffect: Para leer el término de búsqueda de la URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const termFromUrl = params.get('search'); // Obtiene el valor del parámetro 'search'
        if (termFromUrl) {
            setSearchTerm(termFromUrl); // Actualiza el estado local de searchTerm con el de la URL
        } else {
            // Si no hay término en la URL, asegura que el estado local esté vacío
            setSearchTerm('');
        }
    }, [location.search]); // Se re-ejecuta cuando cambia la cadena de consulta de la URL

    // useEffect principal para la carga de productos con filtros
    const fetchProducts = useCallback(async () => { // Envuelve en useCallback
        setLoading(true);
        setError(null);
        try {
            const params = {
                // Usa el estado `searchTerm` (que ahora puede venir de la URL o del input local)
                searchTerm: searchTerm,
                // Asegúrate de que categories se envíe solo si hay filtros seleccionados
                categories: selectedFilters.length > 0 ? selectedFilters.join(',') : undefined,
                sucursalId: selectedSucursalId || undefined // Envía undefined si no hay sucursal seleccionada
            };

            const response = await axios.get('http://localhost:8080/api/products', {
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
    }, [selectedFilters, searchTerm, selectedSucursalId]); // Dependencias para useCallback

    useEffect(() => {
        fetchProducts(); // Llama a la función de obtención de productos
    }, [fetchProducts]); // Se re-ejecuta cuando `fetchProducts` cambia (debido a sus dependencias)


    // --- FUNCIÓN PARA FORMATEAR EL PRECIO COMO PESO CHILENO (CLP) ---
    const formatPriceCLP = (price) => {
        if (price == null) {
            return 'Precio no disponible';
        }
        // Crea un formateador para Peso Chileno (CLP)
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0, // No decimales para CLP
            maximumFractionDigits: 0  // No decimales para CLP
        });
        return formatter.format(price);
    };
    // --- FIN FUNCIÓN FORMATEO ---


    return (
        <div className="product-list-page-container">
            <FilterSidebar onFilterChange={handleFilterChange} />

            <div className="products-content">
                <h2>Nuestros Productos</h2>

                <div className="product-controls">
                    {/* Contenedor para el input de búsqueda local y la 'X' */}
                    <div className="search-input-wrapper-local">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o descripción..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {/* Botón de borrar 'X', visible solo si hay texto en searchTerm */}
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
                            {/* --- APLICA EL FORMATEO DEL PRECIO AQUÍ --- */}
                            <p className="price">
                                {formatPriceCLP(product.precio)}
                            </p>
                            {/* --- FIN DEL FORMATEO --- */}
                            <button className="add-to-cart-button">Añadir al Carrito</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductListPage;