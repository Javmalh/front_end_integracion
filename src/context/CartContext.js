import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('ferremax_cart');
            if (!storedCart) return { items: [] };

            const parsedCart = JSON.parse(storedCart);

            const validItems = parsedCart.items.filter(item =>
                item?.product?.id &&
                item?.sucursal?.id &&
                typeof item.quantity === 'number' && item.quantity >= 1
            );
            console.log('CartContext: Carrito cargado de localStorage. Ítems válidos:', validItems.length, 'Total ítems:', parsedCart.items.length);
            return { items: validItems };
        } catch (error) {
            console.error("CartContext: Error al parsear el carrito desde localStorage:", error);
            return { items: [] };
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('ferremax_cart', JSON.stringify(cart));
            console.log('CartContext: Carrito guardado en localStorage.', cart.items.length, 'ítems.');
        } catch (error) {
            console.error("CartContext: Error al guardar el carrito en localStorage:", error);
        }
    }, [cart]);

    const addItem = useCallback((product, sucursal, quantityToAdd = 1) => {
        setCart(prevCart => {
            if (!product || !product.id || !sucursal || !sucursal.id) {
                console.error("CartContext: addItem - Producto o Sucursal no tienen ID o son indefinidos.", { product, sucursal });
                return prevCart;
            }
            if (typeof quantityToAdd !== 'number' || quantityToAdd < 1) {
                console.warn("CartContext: addItem - Cantidad a añadir inválida, ajustando a 1.", quantityToAdd);
                quantityToAdd = 1;
            }

            const existingItemIndex = prevCart.items.findIndex(
                (item) => item.product.id === product.id && item.sucursal.id === sucursal.id
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevCart.items];
                updatedItems[existingItemIndex].quantity += quantityToAdd;
                console.log(`Carrito: Cantidad de ${product.nombre} actualizada a ${updatedItems[existingItemIndex].quantity}`);
                return { ...prevCart, items: updatedItems };
            } else {
                const newItem = {
                    productId: product.id,
                    product: product,
                    branchId: sucursal.id,
                    sucursal: sucursal,
                    quantity: quantityToAdd,
                };
                console.log(`Carrito: ${product.nombre} añadido como nuevo ítem. Cantidad: ${quantityToAdd}`);
                return { ...prevCart, items: [...prevCart.items, newItem] };
            }
        });
        return true;
    }, []);

    const removeItem = useCallback((productId, sucursalId) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.filter(
                (item) => !(item.product.id === productId && item.sucursal.id === sucursalId)
            );
            console.log(`Carrito: Producto ID ${productId} de Sucursal ID ${sucursalId} eliminado.`);
            return { ...prevCart, items: updatedItems };
        });
    }, []);

    const updateItemQuantity = useCallback((productId, sucursalId, newQuantity) => {
        setCart((prevCart) => {
            const quantityToSet = (typeof newQuantity === 'number' && newQuantity >= 1) ? newQuantity : 1;
            const updatedItems = prevCart.items.map((item) =>
                item.product.id === productId && item.sucursal.id === sucursalId
                    ? { ...item, quantity: quantityToSet }
                    : item
            );
            console.log(`Carrito: Cantidad de producto ID ${productId} en Sucursal ID ${sucursalId} actualizada a ${quantityToSet}`);
            return { ...prevCart, items: updatedItems };
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart({ items: [] });
        console.log("Carrito vaciado.");
    }, []);

    const getTotalItems = useCallback(() => {
        return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
    }, [cart.items]);

    const getTotalPrice = useCallback(() => {
        let calculatedSubtotal = 0;
        console.log("CartContext (getTotalPrice): Iniciando cálculo del total. Número de ítems:", cart.items.length);
        cart.items.forEach((item, index) => {
            const itemPrice = typeof item.product?.precio === 'number' ? item.product.precio : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;

            const itemSubtotal = itemPrice * itemQuantity;
            calculatedSubtotal += itemSubtotal;

            console.log(`CartContext (getTotalPrice): Ítem ${index}: Nombre: ${item.product?.nombre || 'N/A'}, Precio: ${itemPrice}, Cantidad: ${itemQuantity}, Subtotal Ítem: ${itemSubtotal}`);
        });
        console.log("CartContext (getTotalPrice): Total calculado FINAL:", calculatedSubtotal);
        return { subtotal: calculatedSubtotal, total: calculatedSubtotal };
    }, [cart.items]);

    const contextValue = useMemo(() => ({ // <-- useMemo importado y usado correctamente
        cart,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        setCart,
    }), [cart, addItem, removeItem, updateItemQuantity, clearCart, getTotalItems, getTotalPrice, setCart]);

    return (
        <CartContext.Provider value={contextValue}> {/* <-- ¡CORRECCIÓN AQUÍ! */}
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};