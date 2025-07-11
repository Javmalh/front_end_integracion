import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TransactionHistoryPage.css';

function TransactionHistoryPage() {
    const [transactions, setTransactions] = useState([]);
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

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            if (!jwtToken) {
                throw new Error("No hay token de autenticación. Por favor, inicia sesión.");
            }


            const response = await api.get('/orders/my-orders');

            setTransactions(response.data);
            console.log("TransactionHistoryPage: Transacciones/Órdenes recibidas:", response.data);

        } catch (err) {
            console.error('TransactionHistoryPage: Error al cargar transacciones:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Acceso no autorizado. Por favor, inicia sesión para ver tu historial de pagos.');
                    toast.error('Acceso no autorizado al historial de transacciones.');
                } else {
                    setError(err.response.data.message || 'Error al cargar el historial de transacciones.');
                    toast.error('Error al cargar el historial de transacciones.');
                }
            } else {
                setError('Error inesperado al cargar el historial de transacciones.');
                toast.error('Error inesperado al cargar el historial.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    if (loading) {
        return (
            <div className="transaction-history-container">
                <p className="loading-message">Cargando historial de transacciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transaction-history-container">
                <p className="error-message">{error}</p>
                <Link to="/profile" className="back-button">Volver al Perfil</Link>
            </div>
        );
    }

    return (
        <div className="transaction-history-container">
            <h2>Mi Historial de Pagos</h2>
            {transactions.length === 0 ? (
                <p className="no-transactions-message">No se encontraron transacciones en tu historial.</p>
            ) : (
                <div className="transaction-list">
                    {transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-card">
                            <div className="transaction-header">
                                <h3>Orden ID: {transaction.id}</h3>
                                <span className={`transaction-status ${transaction.status ? transaction.status.toLowerCase() : 'unknown'}`}>
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="transaction-details">
                                <p><strong>Monto Orden:</strong> {formatPriceCLP(transaction.total)}</p>
                                <p><strong>Fecha Orden:</strong> {formatDate(transaction.orderDate)}</p>
                                <p><strong>Sucursal:</strong> {transaction.sucursal}</p>
                                {transaction.transactionToken && (
                                    <>
                                        <hr />
                                        <p><strong>Estado Pago:</strong> <span className={`status-${transaction.transactionStatus ? transaction.transactionStatus.toLowerCase() : 'unknown'}`}>{transaction.transactionStatus}</span></p>
                                        <p className="transaction-token">Token: {transaction.transactionToken}</p>
                                    </>
                                )}
                            </div>
                            <Link to={`/my-orders/${transaction.id}`} className="view-order-link">Ver Productos de la Orden</Link>
                        </div>
                    ))}
                </div>
            )}
            <Link to="/profile" className="back-button">Volver al Perfil</Link>
        </div>
    );
}

export default TransactionHistoryPage;