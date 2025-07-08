// src/components/Cart/CartSummary.js
import React from 'react';
import './CartSummary.css'; // Asegúrate de tener este CSS

function CartSummary({ cart, getTotalPrice }) {
    return (
        <div className="cart-summary-card">
            <h3>Resumen del Pedido</h3>
            <div className="summary-item">
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            {/* Puedes añadir más líneas aquí para impuestos, envío, etc. si tu app lo necesita */}
            {/* <div className="summary-item">
                <span>Envío:</span>
                <span>$5.00</span>
            </div>
            <div className="summary-item">
                <span>Impuestos:</span>
                <span>$2.00</span>
            </div> */}
            <div className="summary-total">
                <span>Total a Pagar:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            {/* El botón de checkout ya está en CartPage, así que no lo repetimos aquí */}
        </div>
    );
}

export default CartSummary;