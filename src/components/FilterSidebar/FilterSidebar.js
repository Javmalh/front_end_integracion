// src/components/FilterSidebar/FilterSidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './FilterSidebar.css';

function FilterSidebar({ onFilterChange }) {
    const [availableCategories, setAvailableCategories] = useState([]); // Estado para las categorías obtenidas de la API
    const [selectedFilters, setSelectedFilters] = useState([]); // Estado para los filtros que el usuario ha seleccionado
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // useEffect para cargar las categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setErrorCategories(null);
            try {
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

    // Maneja el cambio de los checkboxes de filtro
    const handleCheckboxChange = (filter) => {
        let newFilters;
        if (selectedFilters.includes(filter)) {
            newFilters = selectedFilters.filter(f => f !== filter);
        } else {
            newFilters = [...selectedFilters, filter];
        }
        setSelectedFilters(newFilters);
        onFilterChange(newFilters); // Llama a la función del padre para actualizar los productos
    };

    const handleClearFilters = () => {
        setSelectedFilters([]);
        onFilterChange([]);
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
                                    checked={selectedFilters.includes(category)}
                                    onChange={() => handleCheckboxChange(category)}
                                />
                                {category}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            <button className="clear-filters-button" onClick={handleClearFilters}>
                Limpiar Filtros
            </button>
        </aside>
    );
}

export default FilterSidebar;