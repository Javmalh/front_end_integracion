// src/components/FilterSidebar/FilterSidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './FilterSidebar.css';

// onFilterChange es la única prop necesaria del padre.
// FilterSidebar maneja su propio estado de categorías seleccionadas.
function FilterSidebar({ onFilterChange }) {
    const [availableCategories, setAvailableCategories] = useState([]); // Estado para las categorías obtenidas de la API
    const [selectedFilters, setSelectedFilters] = useState([]); // Estado interno para los filtros que el usuario ha seleccionado
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // useEffect para cargar las categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setErrorCategories(null);
            try {
                // Se asume que api.js ya maneja la baseURL y el token si es necesario
                // Por ahora, lo dejo con axios.get directo a localhost:8080/api/products/categories
                const response = await axios.get('http://localhost:8080/api/products/categories'); // <--- URL del endpoint de categorías
                setAvailableCategories(response.data);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setErrorCategories('No se pudieron cargar las categorías.');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []); // Se ejecuta una sola vez al montar el componente

    // ¡NUEVO useEffect para notificar al padre cuando selectedFilters cambie!
    useEffect(() => {
        // Solo llama a onFilterChange si el componente está montado y selectedFilters ya tiene un valor inicial
        // Evita la llamada inicial si no es deseada, aunque en este caso, la primera llamada de onFilterChange([])
        // es útil para que el padre sepa el estado inicial.
        onFilterChange(selectedFilters);
    }, [selectedFilters, onFilterChange]); // Dependencias: se ejecuta cada vez que selectedFilters o onFilterChange cambian

    // Maneja el cambio de los checkboxes de filtro
    const handleCheckboxChange = (filter) => {
        setSelectedFilters(prevFilters => {
            // Calcula los nuevos filtros inmutablemente
            if (prevFilters.includes(filter)) {
                return prevFilters.filter(f => f !== filter);
            } else {
                return [...prevFilters, filter];
            }
        });
        // NOTA: Ya NO llamamos a onFilterChange aquí. Lo hace el useEffect.
    };

    // Maneja el clic en el botón "Limpiar Filtros" del sidebar
    const handleClearFilters = () => {
        setSelectedFilters([]); // Limpia el estado interno. El useEffect se encargará de notificar al padre.
    };

    return (
        <aside className="filter-sidebar">
            <h3>Categorías</h3>
            {loadingCategories && <p>Cargando categorías...</p>}
            {errorCategories && <p className="error-message">{errorCategories}</p>}
            {!loadingCategories && !errorCategories && availableCategories.length === 0 && (
                <p>No hay categorías disponibles.</p>
            )}

            {!loadingCategories && !errorCategories && availableCategories.length > 0 && (
                <ul className="filter-categories">
                    {availableCategories.map((category, index) => (
                        <li key={index} className="category-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.includes(category)} // Controla el estado del checkbox
                                    onChange={() => handleCheckboxChange(category)} // Llama al manejador
                                />
                                {category}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            {/* El botón de limpiar filtros dentro del sidebar */}
            <button className="clear-filters-button" onClick={handleClearFilters}>
                Limpiar Filtros
            </button>
        </aside>
    );
}

export default FilterSidebar;