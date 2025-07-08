// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto. No necesitas definir el tipo explícitamente como en TypeScript.
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Inicializar el carrito desde localStorage
        try {
            const storedCart = localStorage.getItem('ferremax_cart');
            return storedCart ? JSON.parse(storedCart) : { items: [] };
        } catch (error) {
            console.error("Error al parsear el carrito desde localStorage:", error);
            return { items: [] };
        }
    });

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        try {
            localStorage.setItem('ferremax_cart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error al guardar el carrito en localStorage:", error);
        }
    }, [cart]);

    const addItem = (product, branch, quantity) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.items.findIndex(
                (item) => item.productId === product.id && item.branchId === branch.id
            );

            if (existingItemIndex > -1) {
                // Si el producto ya existe en la misma sucursal, actualiza la cantidad
                const updatedItems = [...prevCart.items];
                updatedItems[existingItemIndex].quantity += quantity;
                return { ...prevCart, items: updatedItems };
            } else {
                // Si no existe, añade un nuevo item
                const newItem = {
                    productId: product.id,
                    product: product, // Información detallada del producto
                    branchId: branch.id,
                    branch: branch,   // Información detallada de la sucursal
                    quantity: quantity,
                };
                return { ...prevCart, items: [...prevCart.items, newItem] };
            }
        });
    };

    const removeItem = (productId, branchId) => {
        setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.filter(
                (item) => !(item.productId === productId && item.branchId === branchId)
            ),
        }));
    };

    const updateItemQuantity = (productId, branchId, newQuantity) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.map((item) =>
                item.productId === productId && item.branchId === branchId
                    ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } // Asegura que la cantidad sea al menos 1
                    : item
            );
            return { ...prevCart, items: updatedItems };
        });
    };

    const clearCart = () => {
        setCart({ items: [] });
    };

    const getTotalItems = () => {
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.items.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
    };

    const contextValue = {
        cart,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};