// src/components/FilterSidebar/FilterSidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterSidebar.css';

function FilterSidebar({ onFilterChange }) {
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // useEffect para cargar las categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setErrorCategories(null);
            try {

                const response = await axios.get('http://localhost:8080/api/products/categories');
                setAvailableCategories(response.data);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setErrorCategories('No se pudieron cargar las categorías.');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        onFilterChange(selectedFilters);
    }, [selectedFilters, onFilterChange]);


    const handleCheckboxChange = (filter) => {
        setSelectedFilters(prevFilters => {

            if (prevFilters.includes(filter)) {
                return prevFilters.filter(f => f !== filter);
            } else {
                return [...prevFilters, filter];
            }
        });

    };


    const handleClearFilters = () => {
        setSelectedFilters([]);
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
            {}
            <button className="clear-filters-button" onClick={handleClearFilters}>
                Limpiar Filtros
            </button>
        </aside>
    );
}

export default FilterSidebar;