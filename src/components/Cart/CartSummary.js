import React from 'react';
import './CartSummary.css'; // Asegúrate de tener este CSS

// Helper para formatear precios en CLP
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

function CartSummary({ total }) {
    return (
        <div className="cart-summary-card">
            <h3>Resumen del Pedido</h3>
            <div className="summary-item">
                <span>Subtotal:</span>
                <span>{formatPriceCLP(total)}</span>
            </div>
            {/* Puedes añadir más líneas aquí para impuestos, envío, etc. si tu app lo necesita */}
            <div className="summary-total-final">
                <span>Total a Pagar:</span>
                <span>{formatPriceCLP(total)}</span>
            </div>
        </div>
    );
}

export default CartSummary;