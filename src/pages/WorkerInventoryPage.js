import React, { useState, useEffect, useCallback } from 'react';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import api, { createProduct, updateProduct, deleteProduct, getProducts, getAllProductCategories } from '../services/api';
import axios from 'axios';
import './WorkerInventoryPage.css';
import { toast } from 'react-toastify';


const ProductModal = ({ isOpen, onClose, product = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: product ? product.nombre : '',
        descripcion: product ? product.descripcion : '',
        precio: product ? product.precio : '',
        stock: product ? product.stock : '',
        categoria: product ? product.categoria : '',
        imageUrl: product ? product.imageUrl : '',
    });

    useEffect(() => {
        console.log("ProductModal (useEffect): Ejecutado para producto:", product);
        setFormData({
            nombre: product ? product.nombre : '',
            descripcion: product ? product.descripcion : '',
            precio: product ? product.precio : '',
            stock: product ? product.stock : '',
            categoria: product ? product.categoria : '',
            imageUrl: product ? product.imageUrl : '',
        });
        console.log("ProductModal (useEffect): formData inicializado. imageUrl:", product?.imageUrl || 'VALOR INICIAL NULO/VACÍO');
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'imageUrl') {
                console.log(`ProductModal (handleChange): Campo 'imageUrl' cambiado a '${value}'.`);
            }
            return newState;
        });
    };

    const handleSubmit = (e) => {
        console.log("ProductModal (handleSubmit): Botón 'submit' pulsado.");
        e.preventDefault();
        console.log("ProductModal (handleSubmit): formData FINAL antes de onSubmit:", formData);
        console.log("ProductModal (handleSubmit): Valor de imageUrl en formData:", formData.imageUrl);
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{product ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre:
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </label>
                    <label>
                        Descripción:
                        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}></textarea>
                    </label>
                    <label>
                        Precio:
                        <input type="number" name="precio" value={formData.precio} onChange={handleChange} required step="0.01" />
                    </label>
                    <label>
                        Stock:
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                    </label>
                    <label>
                        Categoría:
                        <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
                    </label>
                    <label>
                        URL Imagen:
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                    </label>
                    <div className="modal-actions">
                        <button type="submit" className="button-primary">{product ? 'Guardar Cambios' : 'Añadir Producto'}</button>
                        <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function WorkerInventoryPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedSucursalId, setSelectedSucursalId] = useState('');

    const [inventoryProducts, setInventoryProducts] = useState([]);
    const [sucursales, setSucursales] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const handleCategoryFilterChange = useCallback((newFiltersArray) => {
        console.log("WorkerInventoryPage: Filtros de categoría actualizados:", newFiltersArray);
        setSelectedFilters(newFiltersArray);
    }, []);

    const handleSucursalChange = useCallback((event) => {
        setSelectedSucursalId(event.target.value);
        console.log("WorkerInventoryPage: Sucursal seleccionada:", event.target.value);
    }, []);

    const handleClearSearch = () => {
        setSearchTerm('');
        console.log("WorkerInventoryPage: Término de búsqueda limpiado.");
    };

    const fetchInventory = useCallback(async () => {
        console.log("WorkerInventoryPage: Iniciando carga de inventario...");
        setLoading(true);
        setError(null);
        try {
            const params = {
                searchTerm: searchTerm,
                categories: selectedFilters.join(','),
                sucursalId: selectedSucursalId || null
            };
            console.log("WorkerInventoryPage: Parámetros de búsqueda enviados a getProducts:", params);
            const response = await getProducts(params);
            console.log("WorkerInventoryPage: Respuesta de productos recibida:", response.data);
            setInventoryProducts(response.data);
        } catch (err) {
            console.error('WorkerInventoryPage: Error al cargar inventario:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Acceso no autorizado al inventario. Por favor, inicia sesión como trabajador.');
                } else {
                    setError(err.response.data.message || 'Error al cargar el inventario desde el servidor.');
                }
            } else {
                setError('Error inesperado al cargar el inventario.');
            }
        } finally {
            setLoading(false);
            console.log("WorkerInventoryPage: Carga de inventario finalizada. Estado de carga:", false);
        }
    }, [searchTerm, selectedFilters, selectedSucursalId]);

    useEffect(() => {
        const fetchSucursales = async () => {
            console.log("WorkerInventoryPage: Cargando sucursales...");
            try {
                const response = await api.get('/sucursales');
                setSucursales(response.data);
                console.log("WorkerInventoryPage: Sucursales cargadas:", response.data);
            } catch (err) {
                console.error('WorkerInventoryPage: Error al cargar sucursales:', err);
                if (axios.isAxiosError(err) && err.response) {
                    setError(err.response.data.message || 'Error al cargar las sucursales.');
                } else {
                    setError('Error inesperado al cargar las sucursales.');
                }
            }
        };
        fetchSucursales();
    }, []);

    useEffect(() => {
        console.log("WorkerInventoryPage: useEffect - Desencadenando fetchInventory.");
        fetchInventory();
    }, [fetchInventory]);

    const handleOpenAddModal = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
        console.log("WorkerInventoryPage: Abriendo modal para añadir producto.");
    };

    const handleOpenEditModal = (product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
        console.log("WorkerInventoryPage: Abriendo modal para editar producto:", product);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductToEdit(null);
        console.log("WorkerInventoryPage: Cerrando modal.");
    };

    const handleAddOrUpdateProduct = async (productData) => {
        console.log("WorkerInventoryPage (handleAddOrUpdateProduct): INICIADO. Datos recibidos de modal:", productData);
        console.log("WorkerInventoryPage (handleAddOrUpdateProduct): Valor de imageUrl en productData:", productData.imageUrl);
        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id, productData);
                toast.success('Producto actualizado con éxito!');
            } else {
                await createProduct(productData);
                toast.success('Producto añadido con éxito!');
            }
            handleCloseModal();
            fetchInventory();
            console.log("WorkerInventoryPage (handleAddOrUpdateProduct): Producto guardado/actualizado con éxito.");
        } catch (err) {
            console.error('WorkerInventoryPage: ERROR al guardar producto:', err);
            setError(err.response?.data?.message || 'Error al guardar el producto.');
            toast.error('Error al guardar el producto: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteProduct = async (productId) => {
        console.log("WorkerInventoryPage: Intentando eliminar producto ID:", productId);
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID: ${productId}?`)) {
            try {
                await deleteProduct(productId);
                toast.success('Producto eliminado con éxito!');
                fetchInventory();
            } catch (err) {
                console.error('WorkerInventoryPage: Error al eliminar producto:', err);
                setError(err.response?.data?.message || 'Error al eliminar el producto.');
                toast.error('Error al eliminar el producto: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div className="worker-inventory-page">
            <FilterSidebar
                onFilterChange={handleCategoryFilterChange}
            />
            <div className="main-content products-content">
                <h2>Inventario de FerreMax</h2>
                <div className="product-controls">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={handleClearSearch} className="clear-worker-search-button">
                                &#x2715;
                            </button>
                        )}
                    </div>
                    <button onClick={fetchInventory} className="search-controls button">Buscar</button>
                    <select value={selectedSucursalId} onChange={handleSucursalChange} className="sucursal-select">
                        <option value="">Todas las Sucursales</option>
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <p className="loading-message">Cargando inventario...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && inventoryProducts.length === 0 && (
                    <p className="no-products-message">No se encontraron productos.</p>
                )}

                {!loading && !error && inventoryProducts.length > 0 && (
                    <table className="inventory-table">
                        <thead>
                        <tr>
                            <th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Imagen</th><th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventoryProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.nombre}</td>
                                <td>{product.descripcion}</td>
                                <td>${product.precio}</td>
                                <td>{product.stock}</td>
                                <td>{product.categoria}</td>
                                <td>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    ) : (
                                        <img src="https://via.placeholder.com/50?text=No+Img" alt="Sin Imagen" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    )}
                                </td>
                                <td className="product-actions-cell">
                                    <button
                                        onClick={() => handleOpenEditModal(product)}
                                        className="action-button edit-button"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="action-button delete-button"
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <div className="worker-actions">
                    <button onClick={handleOpenAddModal} className="add-product-button">Añadir Nuevo Producto</button>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={productToEdit}
                onSubmit={handleAddOrUpdateProduct}
            />
        </div>
    );
}

export default WorkerInventoryPage;