

import React from 'react';
import { Link } from 'react-router-dom';
import './WorkerDashboardPage.css';

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
                        {}
                        <li><Link to="/worker-inventory">Ver Inventario</Link></li>
                        {}
                    </ul>
                </div>

                <div className="dashboard-section">
                    <h3>Gestión de Pedidos</h3>
                    <p>Revisa, acepta, rechaza y actualiza el estado de los pedidos.</p>
                    <ul>
                        <li><a href="/worker/orders/pending">Ver Pedidos Pendientes</a></li>
                        <li><a href="/worker/orders/all">Ver Todos los Pedidos</a></li>
                        {}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WorkerDashboardPage;