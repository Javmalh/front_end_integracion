// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);


    const API_BASE_URL = 'https://mi-ferreteria-api.com/api'; // ¡AJUSTA ESTA URL A TU BACKEND REAL!

    // Función para cargar el carrito desde el backend
    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);
        try {
            // Si el carrito está asociado a un usuario, la URL debe reflejarlo.
            // Ejemplo: /api/users/{userId}/cart o /api/cart (si el token JWT ya identifica al usuario)
            const response = await fetch(`${API_BASE_URL}/cart`, { // Ejemplo simple con userId en query param
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Si usas JWT
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar el carrito: ' + response.statusText);
            }
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setCartError("No pudimos cargar tu carrito. Intenta de nuevo.");
        } finally {
            setLoadingCart(false);
        }
    }, [API_BASE_URL]); // Dependencias para useCallback

    // Cargar el carrito al montar el proveedor
    useEffect(() => {
        fetchCart();
    }, [fetchCart]); // Asegura que fetchCart se llama solo cuando cambia

    // --- Funciones para interactuar con el carrito ---

    const addItem = async (product, quantity = 1) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, { // Endpoint para añadir
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ productId: product.id, quantity, price: product.precio }), // Asegúrate que tu backend reciba esto
            });

            if (!response.ok) {
                throw new Error('Error al añadir producto al carrito.');
            }
            // Después de una operación exitosa, volvemos a cargar el carrito para tener el estado más reciente
            await fetchCart();
            return true; // Éxito
        } catch (error) {
            console.error("Error al añadir item:", error);
            setCartError(`No se pudo añadir "${product.nombre}": ${error.message}`);
            return false; // Fallo
        }
    };

    const removeItem = async (cartItemId) => { // cartItemId es el ID del item en el carrito, no del producto
        try {
            const response = await fetch(`${API_BASE_URL}/cart/remove/${cartItemId}`, { // Endpoint para eliminar
                method: 'DELETE',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar producto del carrito.');
            }
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al eliminar item:", error);
            setCartError(`No se pudo eliminar el item: ${error.message}`);
            return false;
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) {
            return removeItem(cartItemId); // Si la cantidad es 0 o menos, elimínalo
        }
        try {
            const response = await fetch(`${API_BASE_URL}/cart/update-quantity`, { // Endpoint para actualizar cantidad
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({ cartItemId, quantity: newQuantity }), // Asegúrate que tu backend reciba esto
            });

            if (!response.ok) {
                throw new Error('Error al actualizar cantidad.');
            }
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            setCartError(`No se pudo actualizar la cantidad: ${error.message}`);
            return false;
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, { // Endpoint para vaciar
                method: 'DELETE',
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al vaciar el carrito.');
            }
            await fetchCart(); // Refrescar el estado a vacío
            return true;
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            setCartError(`No se pudo vaciar el carrito: ${error.message}`);
            return false;
        }
    };

    // Los cálculos de total y número de items aún se pueden hacer en el frontend
    // usando los datos que vienen del backend, para no hacer más llamadas de lo necesario.
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.cantidad, 0);
    };

    const value = {
        cartItems,
        loadingCart,
        cartError,
        addItem,
        removeItem,
        updateQuantity,
        getCartTotal,
        getTotalItems,
        clearCart,
        fetchCart // También puede ser útil exponer fetchCart para recargas manuales
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};