// src/main/js/src/pages/WorkerDashboardPage.js

import React from 'react';
import { Link } from 'react-router-dom'; // <-- ¡Importa Link de react-router-dom!
import './WorkerDashboardPage.css'; // Importa el CSS específico para esta página

function WorkerDashboardPage() {
    return (
        <div className="worker-dashboard-container">
            <div className="dashboard-card">
                <h2>Panel de Control del Trabajador - FerreMax</h2>
                <p>¡Bienvenido al área de gestión de FerreMax!</p>

                <div className="dashboard-section">
                    <h3>Gestión de Inventario</h3>
                    <p>Consulta y actualiza el stock de productos.</p>
                    <ul>
                        {/* ¡CORRECCIÓN AQUÍ! Usar <Link> y la ruta correcta '/worker-inventory' */}
                        <li><Link to="/worker-inventory">Ver Inventario</Link></li>
                        {/* <li><a href="/worker/add-product">Añadir Nuevo Producto</a></li> */}
                    </ul>
                </div>

                <div className="dashboard-section">
                    <h3>Gestión de Pedidos</h3>
                    <p>Revisa, acepta, rechaza y actualiza el estado de los pedidos.</p>
                    <ul>
                        <li><a href="/worker/orders/pending">Ver Pedidos Pendientes</a></li>
                        <li><a href="/worker/orders/all">Ver Todos los Pedidos</a></li>
                        {/* <li><a href="/worker/orders/status">Cambiar Estado de Pedido</a></li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WorkerDashboardPage;