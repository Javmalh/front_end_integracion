// src/components/CartPage.js
import React from 'react';
import { useCart } from '../components/Cart/CartProvider';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import './CartPage.css';

function CartPage() {
    const { cartItems, loadingCart, cartError, getTotalItems, clearCart, fetchCart } = useCart();

    if (loadingCart) {
        return (
            <div className="cart-page loading-message-container">
                <h2>Cargando tu Carrito...</h2>
                <p>Por favor, espera mientras recuperamos tus productos.</p>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="cart-page error-message-container">
                <h2>Error al Cargar el Carrito</h2>
                <p>{cartError}</p>
                <button onClick={fetchCart} className="retry-button">Intentar de Nuevo</button>
            </div>
        );
    }

    if (getTotalItems() === 0) {
        return (
            <div className="cart-page empty-cart-message-container">
                <h2>Tu Carrito de Compras</h2>
                <p>Tu carrito está vacío. ¡Es hora de agregar algunas herramientas!</p>
                <a href="/" className="back-to-shop-button">Volver a la Tienda</a>
            </div>
        );
    }

    const handleCheckout = async () => {
        // En este escenario, el checkout podría ser un simple POST a tu backend
        // que ya tiene los ítems del carrito asociados al usuario.
        // O podrías enviar un ID de carrito/usuario al endpoint de checkout.
        try {
            const API_BASE_URL = 'https://mi-ferreteria-api.com/api'; // Tu URL de backend

            const response = await fetch(`${API_BASE_URL}/orders/checkout`, { // Ajusta a tu endpoint de checkout
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Necesario si el backend requiere autenticación
                },
                // Si tu endpoint de checkout necesita más datos (ej. shippingAddress, paymentMethod), inclúyelos aquí.
                // Si el backend ya conoce el carrito por el token/sesión del usuario, el body puede ser vacío o mínimo.
                body: JSON.stringify({ userId: "usuario123" }) // Ejemplo: enviar el userId si es necesario.
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.message || 'Error al finalizar la compra');
            }

            const result = await response.json();
            alert('¡Orden procesada con éxito! ID de la orden: ' + result.orderId);
            await clearCart(); // Vaciar el carrito en el backend y luego refrescar el frontend
            // Redirigir al usuario a una página de confirmación
            // window.location.href = '/order-confirmation/' + result.orderId;

        } catch (error) {
            console.error('Error durante el checkout:', error);
            alert('Hubo un problema al procesar tu orden: ' + error.message);
        }
    };

    return (
        <div className="cart-page">
            <h2>Tu Carrito de Compras ({getTotalItems()} artículos)</h2>
            <div className="cart-content">
                <div className="cart-items-list">
                    {cartItems.map(item => (
                        // Asegúrate de que 'item.id' aquí sea el ID del item del carrito, no el ID del producto.
                        <CartItem key={item.id} item={item} />
                    ))}
                    <button onClick={clearCart} className="clear-cart-button" disabled={loadingCart}>Vaciar Carrito</button>
                </div>
                <CartSummary />
            </div>
            <div className="cart-actions">
                <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
                    Continuar Comprando
                </button>
                <button className="checkout-btn" onClick={handleCheckout} disabled={loadingCart}>
                    Ir a Pagar
                </button>
            </div>
        </div>
    );
}

export default CartPage;