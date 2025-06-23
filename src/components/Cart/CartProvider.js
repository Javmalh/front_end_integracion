// src/main/js/src/components/Cart/CartContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../../services/api'; // <<< ¡IMPORTAR LA INSTANCIA 'api' CONFIGURADA!
const CartContext = createContext();

export const useCart = () => useContext(CartContext); // <--- ¡ESTA ES LA LÍNEA MARCADA!

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);

    // Función para cargar el carrito desde el backend
    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setCartItems([]);
            setLoadingCart(false);
            console.log("No hay token JWT en localStorage. El carrito no se cargará automáticamente.");
            return;
        }

        try {
            const response = await api.get('/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error("Error al cargar el carrito en CartProvider:", error);
            if (error.response) {
                if (error.response.status !== 401) {
                    setCartError(error.response.data.message || 'Error al cargar tu carrito.');
                }
            } else {
                setCartError("No pudimos cargar tu carrito. Verifica tu conexión.");
            }
        } finally {
            setLoadingCart(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (product, quantity = 1, sucursalId) => {
        setCartError(null);
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setCartError("Necesitas iniciar sesión para añadir productos al carrito.");
            return false;
        }
        try {
            const response = await api.post('/cart/add', {
                productoId: product.id,
                quantity: quantity,
                sucursalId: sucursalId
            });
            setCartItems(response.data.items || []);
            return true;
        } catch (error) {
            console.error("Error al añadir item:", error);
            if (error.response) {
                setCartError(`No se pudo añadir "${product.nombre}": ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo añadir "${product.nombre}": ${error.message}`);
            }
            return false;
        }
    };

    const removeItem = async (cartItemId) => {
        setCartError(null);
        const token = localStorage.getItem('jwtToken');
        if (!token) { return false; }
        try {
            await api.delete(`/cart/remove/${cartItemId}`);
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al eliminar item:", error);
            if (error.response) {
                setCartError(`No se pudo eliminar el item: ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo eliminar el item: ${error.message}`);
            }
            return false;
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        setCartError(null);
        if (newQuantity <= 0) {
            return removeItem(cartItemId);
        }
        const token = localStorage.getItem('jwtToken');
        if (!token) { return false; }
        try {
            await api.put(`/cart/update/${cartItemId}?quantity=${newQuantity}`);
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            if (error.response) {
                setCartError(`No se pudo actualizar la cantidad: ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo actualizar la cantidad: ${error.message}`);
            }
            return false;
        }
    };

    const clearCart = async () => {
        setCartError(null);
        const token = localStorage.getItem('jwtToken');
        if (!token) { return false; }
        try {
            await api.post('/cart/clear');
            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            if (error.response) {
                setCartError(`No se pudo vaciar el carrito: ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo vaciar el carrito: ${error.message}`);
            }
            return false;
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
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
        fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};