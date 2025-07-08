// src/components/CartPage.js
import React from 'react';
// Asegúrate de que la ruta a tu CartProvider sea la correcta
// Si CartContext.js está en src/context, la ruta sería:
import { useCart } from '../context/CartContext';
// Si lo dejaste en src/components/Cart, entonces esta ruta está bien:
// import { useCart } from './Cart/CartProvider';

import CartItem from '../components/Cart/CartItem'; // Este componente necesita ser actualizado
import CartSummary from '../components/Cart/CartSummary'; // Este componente también puede necesitar ser actualizado
import './CartPage.css';

function CartPage() {
    // Accede a las propiedades del carrito desde el contexto local
    const { cart, removeItem, updateItemQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();

    // Elimina loadingCart y cartError, ya que el carrito es local y carga síncrona
    // Puedes tener un estado de carga para el checkout si quieres.
    const [isProcessingCheckout, setIsProcessingCheckout] = React.useState(false);
    const [checkoutError, setCheckoutError] = React.useState(null);

    // Si el carrito está vacío
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
        setIsProcessingCheckout(true);
        setCheckoutError(null); // Limpiar errores previos

        try {
            const API_BASE_URL = 'http://localhost:8080/api'; // <--- ¡IMPORTANTE! Ajusta esta URL a la de tu backend de Spring Boot
            // Si el usuario está logueado, deberías enviar el token de autenticación
            const jwtToken = localStorage.getItem('jwtToken'); // Obtener el token del localStorage

            // Prepara los ítems del carrito para enviar al backend.
            // Solo envía la información mínima necesaria para que el backend valide y cree la orden.
            const orderItems = cart.items.map(item => ({
                productId: item.productId,
                branchId: item.branchId,
                quantity: item.quantity
            }));

            const response = await fetch(`${API_BASE_URL}/orders/checkout`, { // Ajusta a tu endpoint de checkout
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Si el backend requiere autenticación, incluye el token:
                    ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` })
                },
                body: JSON.stringify({
                    items: orderItems,
                    // Puedes añadir aquí otros datos como:
                    // shippingAddress: "Calle Falsa 123",
                    // paymentMethod: "Tarjeta de Crédito",
                })
            });

            if (!response.ok) {
                const errorData = await response.json(); // Leer los detalles del error del backend
                throw new Error(errorData.message || 'Error al finalizar la compra');
            }

            const result = await response.json();
            alert('¡Orden procesada con éxito! ID de la orden: ' + result.orderId);
            clearCart(); // Vaciar el carrito local después de la compra exitosa
            // Redirigir al usuario a una página de confirmación
            // window.location.href = '/order-confirmation/' + result.orderId;

        } catch (error) {
            console.error('Error durante el checkout:', error);
            setCheckoutError(error.message || 'Hubo un problema al procesar tu orden.');
            alert('Hubo un problema al procesar tu orden: ' + (error.message || 'Error desconocido'));
        } finally {
            setIsProcessingCheckout(false);
        }
    };

    return (
        <div className="cart-page">
            <h2>Tu Carrito de Compras ({getTotalItems()} artículos)</h2>
            {checkoutError && <div className="checkout-error-message">{checkoutError}</div>}
            <div className="cart-content">
                <div className="cart-items-list">
                    {cart.items.map(item => (
                        // Pasamos el 'item' completo y las funciones de manejo al CartItem
                        <CartItem
                            key={`${item.productId}-${item.branchId}`} // Usa una clave única combinando producto y sucursal
                            item={item}
                            removeItem={removeItem}
                            updateItemQuantity={updateItemQuantity}
                        />
                    ))}
                    <button onClick={clearCart} className="clear-cart-button">Vaciar Carrito</button>
                </div>
                {/* Pasa el carrito y las funciones de total a CartSummary si las necesita */}
                <CartSummary cart={cart} getTotalPrice={getTotalPrice} />
            </div>
            <div className="cart-actions">
                <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
                    Continuar Comprando
                </button>
                <button className="checkout-btn" onClick={handleCheckout} disabled={isProcessingCheckout}>
                    {isProcessingCheckout ? 'Procesando...' : 'Ir a Pagar'}
                </button>
            </div>
        </div>
    );
}

export default CartPage;