import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import './CartPage.css';

function CartPage() {
    const { cart, removeItem, updateItemQuantity, getTotalItems, getTotalPrice, clearCart, setCart } = useCart();
    const navigate = useNavigate();

    const [isProcessingCheckout, setIsProcessingCheckout] = React.useState(false);
    const [checkoutError, setCheckoutError] = React.useState(null);

    const validItems = React.useMemo(() =>
            cart.items.filter(item =>
                item?.product?.id && item?.sucursal?.id && typeof item.quantity === 'number' && item.quantity >= 1
            ),
        [cart.items]
    );

    console.debug('Estado actual del carrito (depuración):', {
        totalItems: cart.items.length,
        validItemsCount: validItems.length,
        itemsDetail: cart.items.map(item => ({
            productId: item?.product?.id,
            sucursalId: item?.sucursal?.id,
            quantity: item?.quantity,
            isValid: !!(item?.product?.id && item?.sucursal?.id && typeof item.quantity === 'number' && item.quantity >= 1)
        }))
    });

    React.useEffect(() => {
        if (cart.items.length !== validItems.length) {
            console.warn('CartPage: Se encontraron ítems inválidos o con cantidad no numérica/cero. Limpiando el carrito...');
            setCart(prevCart => ({ ...prevCart, items: validItems }));
        }
    }, [cart.items, validItems, setCart]);

    if (validItems.length === 0) {
        return (
            <div className="cart-page empty-cart-message-container">
                <h2>Tu Carrito de Compras</h2>
                <p>Tu carrito está vacío. ¡Es hora de agregar algunas herramientas!</p>
                <Link to="/" className="back-to-shop-button">Volver a la tienda</Link>
            </div>
        );
    }

    const handleCheckout = async () => {
        setIsProcessingCheckout(true);
        setCheckoutError(null);

        try {
            // --- ¡DEPURACIÓN ADICIONAL AQUÍ! ---
            console.log("CartPage (handleCheckout): Verificando total antes de enviar al backend.");
            console.log("CartPage (handleCheckout): Resultado de getTotalPrice():", getTotalPrice());
            console.log("CartPage (handleCheckout): Valor de getTotalPrice().total:", getTotalPrice().total);
            // ------------------------------------

            const API_BASE_URL = 'http://localhost:8080/api';
            const jwtToken = localStorage.getItem('jwtToken');

            const orderItems = validItems
                .map(item => ({
                    productId: item.product.id,
                    sucursalId: item.sucursal.id,
                    quantity: item.quantity
                }));

            const mainSucursalName = validItems.length > 0 ? validItems[0].sucursal.nombre : 'Desconocida';

            const checkoutTotalAmount = getTotalPrice().total || 0;
            if (checkoutTotalAmount <= 0) {
                throw new Error("El monto total del carrito debe ser mayor a cero para proceder al pago.");
            }

            const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` })
                },
                body: JSON.stringify({
                    items: orderItems,
                    totalAmount: checkoutTotalAmount,
                    sucursalName: mainSucursalName
                })
            });

            if (!response.ok) {
                let errorDetails = 'Error desconocido al procesar la orden desde el servidor.';
                try {
                    const errorJson = await response.json();
                    errorDetails = errorJson.message || errorJson.error || errorDetails;
                } catch (e) {
                    const errorText = await response.text();
                    errorDetails = errorText || `Error ${response.status}: ${response.statusText}. ` + errorDetails;
                    console.warn('Respuesta de error del backend no es JSON, usando texto plano:', errorText);
                }
                throw new Error(errorDetails);
            }

            const result = await response.json();

            if (result && result.url) {
                window.location.href = result.url;
            } else {
                throw new Error('No se recibió una URL de pago válida de Transbank.');
            }

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
                    {validItems.map(item => (
                        <CartItem
                            key={`${item.product.id}-${item.sucursal.id}`}
                            item={item}
                            removeItem={removeItem}
                            updateItemQuantity={updateItemQuantity}
                        />
                    ))}
                    {validItems.length > 0 && (
                        <button onClick={clearCart} className="clear-cart-button">
                            Vaciar Carrito
                        </button>
                    )}
                </div>
                <CartSummary total={getTotalPrice()} />
            </div>
            <div className="cart-actions">
                <Link to="/" className="continue-shopping-btn">
                    Continuar Comprando
                </Link>
                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={isProcessingCheckout || validItems.length === 0}
                >
                    {isProcessingCheckout ? 'Procesando...' : 'Ir a Pagar'}
                </button>
            </div>
        </div>
    );
}

export default CartPage;