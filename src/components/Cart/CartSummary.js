// src/components/CartSummary.js
import React, { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import './CartSummary.css'; // Asegúrate de crear este archivo para los estilos

function CartSummary() {
    const { cartItems, getCartTotal } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotalItems = parseFloat(getCartTotal());

    // Simulación de costos de envío e impuestos.
    // En un caso real, el envío podría calcularse según la dirección del usuario
    // o impuestos basados en la ubicación.
    const shippingCost = cartItems.length > 0 ? 5.00 : 0; // $5 de envío si hay items
    const taxesRate = 0.19; // 19% de impuestos (ajusta según la regulación en Chile)
    const estimatedTaxes = (subtotalItems * taxesRate);

    // Calcular el total antes del descuento, luego aplicar el descuento
    const totalBeforeDiscount = subtotalItems + shippingCost + estimatedTaxes;
    const finalTotal = (totalBeforeDiscount - discount);

    const handleApplyCoupon = () => {
        // Aquí puedes hacer una llamada a tu backend para validar y aplicar cupones
        // Por ejemplo: fetch('http://localhost:8080/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code: couponCode })})
        // Por ahora, una simulación simple en el frontend:
        if (couponCode.toLowerCase() === 'ferreteria10') {
            const calculatedDiscount = subtotalItems * 0.10; // 10% de descuento
            setDiscount(calculatedDiscount);
            alert('Cupón "FERRETERIA10" aplicado: -$' + calculatedDiscount.toFixed(2));
        } else {
            setDiscount(0);
            alert('Cupón inválido o no aplicable.');
        }
    };

    // Resetear descuento si el subtotal de items cambia o si el carrito se vacía
    useEffect(() => {
        if (cartItems.length === 0) {
            setDiscount(0);
        }
    }, [cartItems]);


    return (
        <div className="cart-summary">
            <h3>Resumen del Pedido</h3>
            <p>Subtotal de Artículos: $<span className="summary-value">{subtotalItems.toFixed(2)}</span></p>
            <p>Envío: $<span className="summary-value">{shippingCost.toFixed(2)}</span></p>
            <p>Impuestos ({taxesRate * 100}%): $<span className="summary-value">{estimatedTaxes.toFixed(2)}</span></p>

            <div className="coupon-section">
                <input
                    type="text"
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                />
                <button onClick={handleApplyCoupon} className="apply-coupon-btn">Aplicar</button>
            </div>
            {discount > 0 && (
                <p className="discount-applied">Descuento: $-<span className="summary-value">{discount.toFixed(2)}</span></p>
            )}

            <hr />
            <h4>Total a Pagar: $<span className="summary-value total-value">{finalTotal.toFixed(2)}</span></h4>
        </div>
    );
}

export default CartSummary;