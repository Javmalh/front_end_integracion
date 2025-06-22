// src/pages/ProductListPage.js
import React, { useState, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import './ProductListPage.css';
import axios from 'axios'; // Importa axios

function ProductListPage() {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // Puedes obtener las sucursales aquí o pasarlas desde el Header/App si ya las cargas globalmente
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState(''); // Estado para la sucursal seleccionada

    // Función para manejar el cambio en los filtros de la barra lateral
    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
    };

    // Función para manejar el cambio en el término de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para manejar el cambio en la selección de sucursal
    const handleSucursalChange = (e) => {
        setSelectedSucursalId(e.target.value);
    };

    // useEffect para cargar las sucursales (puedes reutilizar tu endpoint existente)
    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                // Asume que tienes un endpoint para obtener todas las sucursales
                const response = await axios.get('http://localhost:8080/api/sucursales'); // Ajusta esta URL
                setSucursales(response.data);
            } catch (err) {
                console.error("Error al cargar sucursales:", err);
                // Maneja el error, quizás mostrando un mensaje al usuario
            }
        };
        fetchSucursales();
    }, []); // Se ejecuta una sola vez al montar el componente


    // useEffect principal para la carga de productos con filtros
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    searchTerm: searchTerm,
                    categories: selectedFilters.join(','), // Envía la lista de filtros como una cadena separada por comas
                    sucursalId: selectedSucursalId || null // Si está vacío, envía null
                };

                const response = await axios.get('http://localhost:8080/api/products', {
                    params: params,
                    // Si tu API de productos requiere autenticación, incluye el token JWT:
                    // headers: {
                    //     'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    // }
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
        };

        fetchProducts(); // Llama a la función de obtención de productos
    }, [selectedFilters, searchTerm, selectedSucursalId]); // Dependencias: re-ejecuta cuando cambian los filtros, el término de búsqueda o la sucursal.

    return (
        <div className="product-list-page-container">
            <FilterSidebar onFilterChange={handleFilterChange} /> {/* Pasa la función para actualizar filtros */}

            <div className="products-content">
                <h2>Nuestros Productos</h2>

                {/* Barra de búsqueda y selector de sucursal */}
                <div className="product-controls">
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre o descripción..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
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
                    <p className="no-products-message">No se encontraron productos para los filtros seleccionados.</p>
                )}
                <div className="product-grid">
                    {!loading && !error && products.map(product => (
                        <div key={product.id} className="product-card">
                            {/* Si tu backend no devuelve imagenUrl, usa una imagen por defecto o placeholder */}
                            <img src={product.imagenUrl || 'https://via.placeholder.com/150?text=No+Imagen'} alt={product.nombre} />
                            <h3>{product.nombre}</h3>
                            <p>Categoría: {product.categoria}</p>
                            <p className="price">${product.precio ? product.precio.toFixed(2) : 'N/A'}</p> {/* Manejar precio nulo */}
                            <button className="add-to-cart-button">Añadir al Carrito</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductListPage;