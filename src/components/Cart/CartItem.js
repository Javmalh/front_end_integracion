// src/components/Cart/CartItem.js
import React from 'react';
import './CartItem.css'; // Asegúrate de tener este CSS

// `item` contendrá { productId, product: {id, nombre, precio}, branchId, branch: {id, nombre}, quantity }
function CartItem({ item, removeItem, updateItemQuantity }) {
    const handleRemove = () => {
        removeItem(item.productId, item.branchId);
    };

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity)) { // Asegura que es un número válido
            updateItemQuantity(item.productId, item.branchId, newQuantity);
        }
    };

    return (
        <div className="cart-item-card">
            <div className="item-details">
                {/* Asumiendo que el producto tiene una imagen URL */}
                {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt={item.product.nombre} className="item-image" />
                )}
                <div className="item-info">
                    <p className="item-name">{item.product.nombre}</p>
                    <p className="item-branch">Sucursal: {item.branch.nombre}</p>
                    <p className="item-price">Precio Unitario: ${item.product.precio.toFixed(2)}</p>
                </div>
            </div>
            <div className="item-quantity-control">
                <label htmlFor={`quantity-${item.productId}-${item.branchId}`}>Cantidad:</label>
                <input
                    type="number"
                    id={`quantity-${item.productId}-${item.branchId}`}
                    min="1"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                />
            </div>
            <div className="item-total">
                <p>Total: ${(item.product.precio * item.quantity).toFixed(2)}</p>
            </div>
            <button onClick={handleRemove} className="remove-item-button">
                &#x2715; {/* Símbolo de "X" o "Eliminar" */}
            </button>
        </div>
    );
}

export default CartItem;