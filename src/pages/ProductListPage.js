import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import axios from 'axios';
import './ProductListPage.css';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import api from '../services/api';

// --- Importa toast ---
import { toast } from 'react-toastify';
// --------------------

function ProductListPage() {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState('');

    const location = useLocation();
    const { addItem } = useCart();

    const handleFilterChange = useCallback((newFilters) => {
        console.log("ProductListPage: Filtros de categoría actualizados:", newFilters);
        setSelectedFilters(newFilters);
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearchTermLocal = () => {
        setSearchTerm('');
    };

    const handleSucursalChange = (e) => {
        setSelectedSucursalId(parseInt(e.target.value, 10));
        console.log("ProductListPage: Sucursal seleccionada:", parseInt(e.target.value, 10));
    };

    useEffect(() => {
        const fetchSucursales = async () => {
            console.log("ProductListPage: Cargando sucursales...");
            try {
                const response = await api.get('/sucursales');
                console.log("Sucursales cargadas del backend:", response.data);
                setSucursales(response.data);
                // Si no hay ninguna sucursal seleccionada, selecciona la primera por defecto
                if (response.data.length > 0 && !selectedSucursalId) {
                    setSelectedSucursalId(response.data[0].id);
                }
            } catch (err) {
                console.error("ProductListPage: Error al cargar sucursales:", err);
            }
        };
        fetchSucursales();
    }, [selectedSucursalId]); // Agrega selectedSucursalId para re-evaluar si debe seleccionar una por defecto

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
        console.log("ProductListPage: Iniciando carga de productos...");
        setLoading(true);
        setError(null);
        try {
            const params = {
                searchTerm: searchTerm,
                categories: selectedFilters.length > 0 ? selectedFilters.join(',') : undefined,
                sucursalId: selectedSucursalId || undefined
            };

            console.log("ProductListPage: Parámetros de búsqueda enviados a getProducts:", params);
            const response = await getProducts(params);

            console.log("ProductListPage: Productos recibidos:", response.data);
            setProducts(response.data);

        } catch (err) {
            console.error('ProductListPage: Error al cargar productos:', err);
            setError('Error al cargar los productos. Inténtalo de nuevo más tarde.');
            if (axios.isAxiosError(err) && err.response) {
                console.error('ProductListPage: Detalles del error del backend:', err.response.data);
                setError(err.response.data.message || 'Error al cargar los productos desde el servidor.');
            }
        } finally {
            setLoading(false);
        }
    }, [selectedFilters, searchTerm, selectedSucursalId]);

    useEffect(() => {
        console.log("ProductListPage: useEffect - Desencadenando fetchProducts.");
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

    const handleAddToCart = (product) => {
        let selectedBranch = sucursales.find(s => s.id === selectedSucursalId);

        if (!selectedBranch && sucursales.length > 0) {
            selectedBranch = sucursales[0]; // Si no se selecciona, toma la primera disponible
        }

        if (!selectedBranch) {
            // --- Reemplazar alert por toast.error para errores ---
            toast.error('No hay sucursales disponibles para añadir este producto. Por favor, selecciona una.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error("Error: No se encontró una sucursal para añadir el producto.");
            return;
        }

        addItem(product, selectedBranch, 1);
        // --- Reemplazar alert por toast.success para éxito ---
        toast.success(`${product.nombre} ha sido añadido al carrito en ${selectedBranch.nombre}!`, {
            position: "top-right",
            autoClose: 3000, // Duración más corta para mensajes de éxito
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        // ----------------------------------------------------
        console.log("Producto añadido:", product.nombre, "a sucursal:", selectedBranch.nombre);
    };

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
                                src={product.imageUrl || 'https://via.placeholder.com/150?text=No+Imagen'}
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