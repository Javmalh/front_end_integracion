// src/components/ProductCard.js
import React from 'react';
import { useCart } from './CartProvider';
import './ProductCard.css';

function ProductCard({ product }) {
    const { addItem } = useCart(); // Ahora addItem interactúa con el backend

    const handleAddToCart = async () => { // Hacerla asíncrona para esperar la respuesta del backend
        const success = await addItem(product, 1);
        if (success) {
            alert(`${product.nombre} añadido al carrito!`);
        } else {
            alert(`Error al añadir ${product.nombre} al carrito. Por favor, intenta de nuevo.`);
        }
    };

    return (
        <div className="product-card">
            <img src={product.imagen || 'https://via.placeholder.com/150?text=Producto'} alt={product.nombre} className="product-image" />
            <h3 className="product-name">{product.nombre}</h3>
            <p className="product-price">${product.precio.toFixed(2)}</p>
            <button onClick={handleAddToCart} className="add-to-cart-btn">Añadir al Carrito</button>
        </div>
    );
}

export default ProductCard;