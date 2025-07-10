import React from 'react';
import { useCart } from '../context/CartContext'; // Asegúrate de que esta ruta sea correcta
import './ProductCard.css'; // Asegúrate de que esta ruta sea correcta

function ProductCard({ product }) {
    const { addItem } = useCart(); // Ahora addItem interactúa con el backend

    // Helper para formatear precios en CLP (puedes reutilizarlo o tener uno global si prefieres)
    const formatPriceCLP = (price) => {
        if (price == null || isNaN(price)) {
            return '$0';
        }
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(price);
    };

    const handleAddToCart = async () => { // Hacerla asíncrona para esperar la respuesta del backend
        // Asegúrate de que esta función addItem esté actualizada en tu CartContext para añadir la sucursal por defecto si es necesario
        // Como tu ProductListPage lo hace, deberías replicar la lógica de "sucursal por defecto" aquí si este ProductCard
        // se usa en un contexto donde no se selecciona sucursal.
        const success = await addItem(product, /* quantity = 1, defaultBranch si es necesario */ 1); // Asume cantidad 1
        if (success) {
            alert(`${product.nombre} añadido al carrito!`);
        } else {
            alert(`Error al añadir ${product.nombre} al carrito. Por favor, intenta de nuevo.`);
        }
    };

    return (
        <div className="product-card">
            <img
                src={product.imageUrl || 'https://via.placeholder.com/150?text=Producto'} // <--- CORRECCIÓN AQUÍ: imageUrl
                alt={product.nombre}
                className="product-image"
            />
            <h3 className="product-name">{product.nombre}</h3>
            <p className="product-price">{formatPriceCLP(product.precio)}</p> {/* Usamos la función de formato */}
            <button onClick={handleAddToCart} className="add-to-cart-btn">Añadir al Carrito</button>
        </div>
    );
}

export default ProductCard;