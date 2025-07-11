import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import { toast } from 'react-toastify';
import './OrderDetailPage.css';

function OrderDetailPage() {
    const { id } = useParams(); // Obtiene el ID de la orden de la URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (e) {
            console.error("Error al formatear fecha:", dateString, e);
            return dateString;
        }
    };


    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
            }


            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
            console.log("OrderDetailPage: Detalles de orden cargados:", response.data);
        } catch (err) {
            console.error(`OrderDetailPage: Error al cargar detalles de la orden ${id}:`, err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Acceso no autorizado. Por favor, inicia sesión para ver los detalles de esta orden.');
                    toast.error('Acceso no autorizado a los detalles de la orden.');
                } else if (err.response.status === 404) {
                    setError('La orden no fue encontrada.');
                    toast.error('Orden no encontrada.');
                } else {
                    setError(err.response.data.message || 'Error al cargar los detalles de la orden.');
                    toast.error('Error al cargar los detalles de la orden.');
                }
            } else {
                setError('Error inesperado al cargar los detalles de la orden.');
                toast.error('Error inesperado al cargar los detalles.');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (loading) {
        return (
            <div className="order-detail-container">
                <p className="loading-message">Cargando detalles de la orden...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-detail-container">
                <p className="error-message">{error}</p>
                <Link to="/my-orders" className="back-button">Volver a Mis Órdenes</Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-container">
                <p className="no-order-message">No se encontraron detalles para esta orden.</p>
                <Link to="/my-orders" className="back-button">Volver a Mis Órdenes</Link>
            </div>
        );
    }

    return (
        <div className="order-detail-container">
            <h2>Detalles de la Orden #{order.id}</h2>
            <div className="order-summary-box">
                <p><strong>Fecha de Orden:</strong> {formatDate(order.orderDate)}</p>
                <p><strong>Estado:</strong> <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></p>
                <p><strong>Total:</strong> {formatPriceCLP(order.total)}</p>
                <p><strong>Sucursal:</strong> {order.sucursal}</p>
                {order.transactionToken && (
                    <p>
                        <strong>Token Transbank:</strong> <span className="transaction-token-display">{order.transactionToken}</span>
                        {}
                        {}
                    </p>
                )}
            </div>

            <h3>Productos Incluidos</h3>
            {order.items && order.items.length > 0 ? (
                <div className="order-items-list">
                    {order.items.map(item => (
                        <div key={item.id} className="order-item-card">
                            <p className="item-name"><strong>{item.productName}</strong></p>
                            <p>Cantidad: {item.quantity}</p>
                            <p>Precio Unitario: {formatPriceCLP(item.unitPrice)}</p>
                            <p className="item-total">Total: {formatPriceCLP(item.totalDetail)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No se encontraron productos para esta orden.</p>
            )}

            <Link to="/my-orders" className="back-button">Volver a Mis Órdenes</Link>
        </div>
    );
}

export default OrderDetailPage;