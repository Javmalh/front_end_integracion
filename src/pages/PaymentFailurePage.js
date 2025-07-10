import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './PaymentResultPage.css'; // CSS común

function PaymentFailurePage() {
    const location = useLocation();
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customMessage, setCustomMessage] = useState(''); // Para mensajes pasados por la URL

    useEffect(() => {
        const token_ws = new URLSearchParams(location.search).get('token_ws');
        const msg = new URLSearchParams(location.search).get('message');
        if (msg) {
            setCustomMessage(msg);
        }

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
            <div className="payment-result-container error">
                <p>Cargando estado de la transacción...</p>
            </div>
        );
    }

    return (
        <div className="payment-result-container error">
            <h2>¡Pago Fallido!</h2>
            <p className="message">
                {customMessage || (error || "Tu transacción no pudo ser procesada o fue rechazada.")}
            </p>
            {transactionStatus && (
                <div className="transaction-details">
                    <p><strong>ID de Orden (Transbank):</strong> {transactionStatus.buyOrder}</p>
                    <p><strong>Código de Respuesta:</strong> {transactionStatus.responseCode}</p>
                    <p><strong>Estado:</strong> {transactionStatus.status}</p>
                    {/* Puedes añadir más detalles según lo que devuelva tu API de estado */}
                </div>
            )}
            <Link to="/" className="button-primary">Volver a Inicio</Link>
        </div>
    );
}

export default PaymentFailurePage;