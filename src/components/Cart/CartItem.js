// src/components/CartItem.js
import React from 'react';
import { useCart } from './CartProvider';
import './CartItem.css';

function CartItem({ item }) {
    const { updateQuantity, removeItem, loadingCart } = useCart();

    const handleQuantityChange = async (e) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            // 'item.id' es el ID del item del carrito, no del producto
            await updateQuantity(item.id, newQuantity);
        }
    };

    const handleIncrease = async () => {
        await updateQuantity(item.id, item.cantidad + 1);
    };

    const handleDecrease = async () => {
        await updateQuantity(item.id, item.cantidad - 1);
    };

    const itemSubtotal = (item.precio * item.cantidad).toFixed(2);

    return (
        <div className="cart-item">
            <img src={item.imagen || 'https://via.placeholder.com/100?text=Producto'} alt={item.nombre} className="cart-item-image" />
            <div className="cart-item-details">
                <h3 className="cart-item-name">{item.nombre}</h3>
                <p className="cart-item-price">Precio Unitario: ${item.precio.toFixed(2)}</p>
                <div className="cart-item-quantity-control">
                    <button onClick={handleDecrease} disabled={item.cantidad <= 1 || loadingCart}>-</button>
                    <input
                        type="number"
                        value={item.cantidad}
                        onChange={handleQuantityChange}
                        min="1"
                        className="cart-item-quantity-input"
                        disabled={loadingCart}
                    />
                    <button onClick={handleIncrease} disabled={loadingCart}>+</button>
                </div>
                <p className="cart-item-subtotal">Subtotal: ${itemSubtotal}</p>
                <button className="cart-item-remove" onClick={() => removeItem(item.id)} disabled={loadingCart}>Eliminar</button>
            </div>
        </div>
    );
}

export default CartItem;