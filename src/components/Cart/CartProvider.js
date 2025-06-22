// src/components/Cart/CartContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios'; // Importa axios

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);

    // MODIFICADO: URL base de tu backend para desarrollo local
    const API_BASE_URL = 'http://localhost:8080/api'; // <--- ¡CORREGIDO!

    // Función para obtener los headers de autorización (incluyendo el token JWT)
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []); // Sin dependencias, ya que localStorage es global

    // Función para cargar el carrito desde el backend
    const fetchCart = useCallback(async () => {
        setLoadingCart(true);
        setCartError(null);

        // Solo intentar cargar el carrito si hay un token JWT disponible
        const headers = getAuthHeaders();
        if (Object.keys(headers).length === 0) { // Si no hay token, no hay headers de auth
            setCartItems([]); // Carrito vacío si no hay usuario autenticado
            setLoadingCart(false);
            return; // Salir si no hay token para evitar 401 innecesarios
        }

        try {
            // Usa axios.get para la solicitud al carrito
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: headers, // Envía los headers de autorización
            });

            // axios envuelve la respuesta en .data
            setCartItems(response.data);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            // Manejo de errores específicos de Axios
            if (axios.isAxiosError(error) && error.response) {
                // Si el error es 401/403, puede ser que el token haya expirado o sea inválido
                if (error.response.status === 401 || error.response.status === 403) {
                    setCartError("Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.");
                    // Opcional: podrías forzar un logout aquí para limpiar el estado
                } else {
                    setCartError(error.response.data.message || 'Error al cargar tu carrito desde el servidor.');
                }
            } else {
                setCartError("No pudimos cargar tu carrito. Verifica tu conexión.");
            }
        } finally {
            setLoadingCart(false);
        }
    }, [getAuthHeaders, API_BASE_URL]); // Dependencias para useCallback

    // Cargar el carrito al montar el proveedor
    useEffect(() => {
        fetchCart();
    }, [fetchCart]); // Asegura que fetchCart se llama solo cuando cambia (debido a useCallback)

    // --- Funciones para interactuar con el carrito (también convertidas a Axios) ---

    const addItem = async (product, quantity = 1) => {
        setCartError(null);
        try {
            const headers = getAuthHeaders();
            if (Object.keys(headers).length === 0) {
                setCartError("Necesitas iniciar sesión para añadir productos al carrito.");
                return false;
            }

            const response = await axios.post(`${API_BASE_URL}/cart/add`,
                { productId: product.id, quantity, price: product.precio },
                { headers: headers }
            );

            await fetchCart(); // Recargar el carrito después de la operación exitosa
            return true;
        } catch (error) {
            console.error("Error al añadir item:", error);
            if (axios.isAxiosError(error) && error.response) {
                setCartError(`No se pudo añadir "${product.nombre}": ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo añadir "${product.nombre}": ${error.message}`);
            }
            return false;
        }
    };

    const removeItem = async (cartItemId) => {
        setCartError(null);
        try {
            const headers = getAuthHeaders();
            if (Object.keys(headers).length === 0) {
                setCartError("Necesitas iniciar sesión para modificar el carrito.");
                return false;
            }
            await axios.delete(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
                headers: headers,
            });

            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al eliminar item:", error);
            if (axios.isAxiosError(error) && error.response) {
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
        try {
            const headers = getAuthHeaders();
            if (Object.keys(headers).length === 0) {
                setCartError("Necesitas iniciar sesión para modificar el carrito.");
                return false;
            }
            const response = await axios.put(`${API_BASE_URL}/cart/update-quantity`,
                { cartItemId, quantity: newQuantity },
                { headers: headers }
            );

            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            if (axios.isAxiosError(error) && error.response) {
                setCartError(`No se pudo actualizar la cantidad: ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo actualizar la cantidad: ${error.message}`);
            }
            return false;
        }
    };

    const clearCart = async () => {
        setCartError(null);
        try {
            const headers = getAuthHeaders();
            if (Object.keys(headers).length === 0) {
                setCartError("Necesitas iniciar sesión para vaciar el carrito.");
                return false;
            }
            await axios.delete(`${API_BASE_URL}/cart/clear`, {
                headers: headers,
            });

            await fetchCart();
            return true;
        } catch (error) {
            console.error("Error al vaciar carrito:", error);
            if (axios.isAxiosError(error) && error.response) {
                setCartError(`No se pudo vaciar el carrito: ${error.response.data.message || error.message}`);
            } else {
                setCartError(`No se pudo vaciar el carrito: ${error.message}`);
            }
            return false;
        }
    };

    // Cálculos basados en el estado local del carrito
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
        fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};