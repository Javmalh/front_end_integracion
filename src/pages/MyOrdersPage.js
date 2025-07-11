import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './MyOrdersPage.css';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
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


    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {

                throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
            }


            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
            console.log("MyOrdersPage: Órdenes cargadas:", response.data);
        } catch (err) {
            console.error('MyOrdersPage: Error al cargar órdenes:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Acceso no autorizado. Por favor, inicia sesión para ver tus órdenes.');
                    toast.error('Acceso no autorizado a tus órdenes.');
                } else {
                    setError(err.response.data.message || 'Error al cargar tus órdenes.');
                    toast.error('Error al cargar tus órdenes.');
                }
            } else {
                setError('Error inesperado al cargar tus órdenes.');
                toast.error('Error inesperado al cargar órdenes.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return (
            <div className="my-orders-container">
                <p className="loading-message">Cargando tus órdenes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-orders-container">
                <p className="error-message">{error}</p>
                <Link to="/profile" className="back-button">Volver al Perfil</Link>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <h2>Mis Órdenes</h2>
            {orders.length === 0 ? (
                <p className="no-orders-message">No tienes órdenes registradas.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Orden #{order.id}</h3>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p><strong>Fecha:</strong> {formatDate(order.orderDate)}</p>
                                <p><strong>Total:</strong> {formatPriceCLP(order.total)}</p>
                                <p><strong>Sucursal:</strong> {order.sucursal}</p>
                                {order.transactionToken && (
                                    <p><strong>Pago:</strong> {order.transactionStatus || 'Procesado'}</p>
                                )}
                            </div>
                            <div className="order-actions">
                                <Link to={`/my-orders/${order.id}`} className="view-details-button">
                                    Ver Productos
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Link to="/profile" className="back-button">Volver al Perfil</Link>
        </div>
    );
}

export default MyOrdersPage;