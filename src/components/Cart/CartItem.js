import React from 'react';
import './CartItem.css'; // Asegúrate de tener este CSS

// Helper para formatear precios en CLP (definido aquí o en un archivo de utilidades)
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

// `item` contendrá { productId, product: {id, nombre, precio, imageUrl}, branchId, sucursal: {id, nombre}, quantity }
function CartItem({ item, removeItem, updateItemQuantity }) {
    const handleRemove = () => {
        // Llama a removeItem con el product.id y sucursal.id
        removeItem(item.product.id, item.sucursal.id);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10); // Base 10 para parseInt
        // Asegura que es un número válido y no menor a 1
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            // Llama a updateItemQuantity con product.id, sucursal.id y la nueva cantidad
            updateItemQuantity(item.product.id, item.sucursal.id, newQuantity);
        } else if (isNaN(newQuantity) || newQuantity < 1) {
            // Si el valor no es un número o es menor a 1, forzar a 1
            updateItemQuantity(item.product.id, item.sucursal.id, 1);
        }
    };

    return (
        <div className="cart-item-card">
            <div className="item-image-container">
                <img
                    src={item.product.imageUrl || 'https://via.placeholder.com/100?text=No+Img'}
                    alt={item.product.nombre}
                    className="item-image"
                />
            </div>
            <div className="item-details-main">
                <h4 className="item-name">{item.product.nombre}</h4>
                <p className="item-branch">Sucursal: {item.sucursal.nombre}</p> {/* Accede a item.sucursal.nombre */}
                <p className="item-price-unit">Precio Unitario: {formatPriceCLP(item.product.precio)}</p>

                <div className="item-quantity-control">
                    <label htmlFor={`quantity-${item.product.id}-${item.sucursal.id}`}>Cantidad:</label>
                    <input
                        type="number"
                        id={`quantity-${item.product.id}-${item.sucursal.id}`}
                        min="1"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                        className="quantity-input"
                    />
                </div>
                <p className="item-total-price">Total: {formatPriceCLP(item.product.precio * item.quantity)}</p>
            </div>
            <button onClick={handleRemove} className="remove-item-button">
                &#x2715;
            </button>
        </div>
    );
}

export default CartItem;