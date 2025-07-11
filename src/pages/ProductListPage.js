import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import axios from 'axios';
import './ProductListPage.css';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import api from '../services/api';
import { toast } from 'react-toastify';

function ProductListPage() {
    // --- ESTADOS ---
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState('');


    const isAddingRef = useRef(false);

    const location = useLocation();
    const { addItem } = useCart();




    const handleCategoryFilterChange = useCallback((newFiltersArray) => {
        console.log("ProductListPage: Filtros de categoría actualizados:", newFiltersArray);
        setSelectedFilters(newFiltersArray);
    }, []);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const handleClearSearch = () => {
        setSearchTerm('');
        console.log("ProductListPage: Término de búsqueda limpiado.");
    };


    const handleSucursalChange = useCallback((event) => {
        setSelectedSucursalId(parseInt(event.target.value, 10));
        console.log("ProductListPage: Sucursal seleccionada:", parseInt(event.target.value, 10));
    }, []);


    const fetchProducts = useCallback(async () => { // Ya es una función useCallback
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
    }, [searchTerm, selectedFilters, selectedSucursalId]);


    const handleAddToCart = async (product, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const clickTimestamp = new Date().toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3});
        console.log(`[${clickTimestamp}] ProductListPage: handleAddToCart INICIADO para: ${product.nombre}. isAddingRef.current: ${isAddingRef.current}`);

        if (isAddingRef.current) {
            console.warn(`[${clickTimestamp}] ProductListPage: isAddingRef.current es TRUE. Ignorando click duplicado.`);
            return;
        }

        isAddingRef.current = true;

        try {
            let selectedBranch = sucursales.find(s => s.id === selectedSucursalId);

            if (!selectedBranch && sucursales.length > 0) {
                selectedBranch = sucursales[0];
            }

            if (!selectedBranch) {
                toast.error('No hay sucursales disponibles para añadir este producto.');
                console.error("Error: No se encontró una sucursal para añadir el producto.");
                return;
            }

            addItem(product, selectedBranch, 1);
            toast.success(`${product.nombre} ha sido añadido al carrito en la sucursal ${selectedBranch.nombre}.`);
            console.log(`[${clickTimestamp}] ProductListPage: Producto añadido localmente. Mensaje toast mostrado.`);

        } catch (error) {
            console.error(`[${clickTimestamp}] ProductListPage: ERROR al añadir al carrito:`, error);
            toast.error(`Error al añadir ${product.nombre} al carrito: ${error.message || 'Desconocido'}`);
        } finally {
            isAddingRef.current = false;
            console.log(`[${clickTimestamp}] ProductListPage: isAddingRef.current establecido a FALSE. FIN de handleAddToCart.`);
        }
    };




    useEffect(() => {
        const fetchSucursales = async () => {
            console.log("ProductListPage: Cargando sucursales...");
            try {
                const response = await api.get('/sucursales');
                console.log("ProductListPage: Sucursales cargadas:", response.data);
                setSucursales(response.data);
            } catch (err) {
                console.error("ProductListPage: Error al cargar sucursales:", err);
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


    return (
        <div className="product-list-page-container">
            <FilterSidebar onFilterChange={handleCategoryFilterChange} />

            <div className="products-content">
                <h2>Nuestros Productos</h2>

                <div className="product-controls">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o ID..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={handleClearSearch} className="clear-worker-search-button">
                                &#x2715;
                            </button>
                        )}
                    </div>
                    <button onClick={fetchProducts} className="search-controls button">Buscar</button>
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
                                className="product-image"
                            />
                            <h3>{product.nombre || 'Producto sin nombre'}</h3>
                            <p>Categoría: {product.categoria || 'N/A'}</p>
                            <p className="price">
                                {formatPriceCLP(product.precio)}
                            </p>
                            <button
                                className="add-to-cart-button"
                                onClick={(e) => handleAddToCart(product, e)}
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