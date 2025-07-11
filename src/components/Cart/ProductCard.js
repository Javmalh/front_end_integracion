import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
    const { addItem } = useCart();


    const formatPriceCLP = (price) => {
        if (price == null || isNaN(price)) {
            return '$0';
        }
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(price);
    };

    const handleAddToCart = async () => {
        const success = await addItem(product,1);
        if (success) {
            alert(`${product.nombre} añadido al carrito!`);
        } else {
            alert(`Error al añadir ${product.nombre} al carrito. Por favor, intenta de nuevo.`);
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.imageUrl || 'https://via.placeholder.com/150?text=Producto'}
                alt={product.nombre}
                className="product-image"
            />
            <h3 className="product-name">{product.nombre}</h3>
            <p className="product-price">{formatPriceCLP(product.precio)}</p> {}
            <button onClick={handleAddToCart} className="add-to-cart-btn">Añadir al Carrito</button>
        </div>
    );
}

export default ProductCard;