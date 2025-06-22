// src/main/js/src/components/Cart/CartContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../../services/api'; // <<< ¡IMPORTAR LA INSTANCIA 'api' CONFIGURADA!

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);

    // Función para cargar el carrito desde el backend
    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);

        // <<< ¡ESTA ES LA LÍNEA CRÍTICA PARA EVITAR EL BUCLYE! >>>
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            // Si no hay token, el usuario no está logueado o su token expiró.
            // No intentamos cargar el carrito para evitar el 401 y el bucle.
            setCartItems([]); // Carrito vacío si no hay autenticación
            setLoadingCart(false);
            console.log("No hay token JWT en localStorage. El carrito no se cargará automáticamente.");
            return; // Salir de la función aquí
        }
        // <<< FIN DE LA LÍNEA CRÍTICA >>>

        try {
            // Usa 'api' para la solicitud. El token se añade automáticamente por el interceptor.
            const response = await api.get('/cart');

            // Asumo que response.data es tu CartResponse completo y los items están dentro.
            setCartItems(response.data.items || []); // Si no hay items, asegura un array vacío
        } catch (error) {
            console.error("Error al cargar el carrito en CartProvider:", error);
            // El interceptor de api.js ya maneja el 401. Aquí puedes manejar otros errores.
            if (error.response) {
                // Solo muestra error si no es un 401, ya que el 401 ya gatilla la redirección.
                if (error.response.status !== 401) {
                    setCartError(error.response.data.message || 'Error al cargar tu carrito.');
                }
            } else {
                setCartError("No pudimos cargar tu carrito. Verifica tu conexión.");
            }
        } finally {
            setLoadingCart(false);
        }
    }, []); // Ya no necesitas dependencias como getAuthHeaders

    // Cargar el carrito al montar el proveedor
    useEffect(() => {
        fetchCart();
    }, [fetchCart]); // Asegura que fetchCart se llama solo cuando cambia (debido a useCallback)

    // --- Funciones para interactuar con el carrito ---

    // Asegúrate de que el componente que llama a addItem le pase sucursalId
    const addItem = async (product, quantity = 1, sucursalId) => {
        setCartError(null);
        // También se puede añadir una comprobación aquí para addItem si el token es nulo antes de intentar
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setCartError("Necesitas iniciar sesión para añadir productos al carrito.");
            return false;
        }
        try {
            // El backend AddToCartRequest espera: productoId, quantity, sucursalId
            const response = await api.post('/cart/add', {
                productoId: product.id, // Nombre del campo como en el DTO del backend
                quantity: quantity,
                sucursalId: sucursalId // Necesario para que el backend lo identifique
            });

            // Actualizar el estado del carrito con la respuesta actualizada del backend
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
        if (!token) { return false; } // No intentar si no hay token
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
        if (!token) { return false; } // No intentar si no hay token
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
        if (!token) { return false; } // No intentar si no hay token
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

    // Cálculos basados en el estado local del carrito
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