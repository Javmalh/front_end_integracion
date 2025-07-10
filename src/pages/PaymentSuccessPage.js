import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './PaymentResultPage.css'; // Crearemos un CSS común para ambas páginas de resultado

function PaymentSuccessPage() {
    const location = useLocation();
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token_ws = new URLSearchParams(location.search).get('token_ws');

        if (token_ws) {
            const fetchTransactionStatus = async () => {
                try {
                    // Llama al endpoint de tu backend para obtener el estado de la transacción
                    const response = await axios.get(`http://localhost:8080/api/payment/status/${token_ws}`);
                    setTransactionStatus(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error("Error al obtener el estado de la transacción:", err);
                    setError("No se pudo obtener el estado de la transacción. Intenta más tarde.");
                    setLoading(false);
                }
            };
            fetchTransactionStatus();
        } else {
            setError("No se encontró el token de transacción en la URL.");
            setLoading(false);
        }
    }, [location.search]);

    if (loading) {
        return (
            <div className="payment-result-container success">
                <p>Cargando estado de la transacción...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-result-container error">
                <h2>¡Error al Confirmar Pago!</h2>
                <p className="message">{error}</p>
                <Link to="/" className="button-primary">Volver a Inicio</Link>
            </div>
        );
    }

    return (
        <div className="payment-result-container success">
            <h2>¡Pago Exitoso!</h2>
            <p className="message">Tu transacción ha sido aprobada.</p>
            {transactionStatus && (
                <div className="transaction-details">
                    <p><strong>ID de Orden (Transbank):</strong> {transactionStatus.buyOrder}</p>
                    <p><strong>Código de Autorización:</strong> {transactionStatus.authorizationCode}</p>
                    <p><strong>Monto:</strong> ${transactionStatus.amount}</p>
                    <p><strong>Tipo de Pago:</strong> {transactionStatus.paymentTypeCode}</p>
                    <p><strong>Últimos 4 dígitos tarjeta:</strong> {transactionStatus.cardDetail?.cardNumber?.slice(-4) || 'N/A'}</p>
                    {/* Puedes añadir más detalles según lo que devuelva tu API de estado */}
                </div>
            )}
            <Link to="/" className="button-primary">Volver a Inicio</Link>
        </div>
    );
}

export default PaymentSuccessPage;