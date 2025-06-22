// src/pages/WorkerDashboardPage.js

import React from 'react';
import './WorkerDashboardPage.css'; // Importa el CSS específico para esta página

// Este componente representará el "Homepage Laboral" para los trabajadores
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
                        <li><a href="/worker/inventory">Ver Inventario</a></li>
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

                {/* Puedes añadir más secciones aquí según las necesidades */}
                {/* <div className="dashboard-section">
          <h3>Reportes y Estadísticas</h3>
          <p>Accede a informes de ventas y rendimiento.</p>
          <ul>
            <li><a href="/worker/reports">Ver Reportes</a></li>
          </ul>
        </div> */}

                <button className="dashboard-logout-button" onClick={() => alert('Simulando cierre de sesión de trabajador.')}>
                    Cerrar Sesión de Trabajador
                </button>
            </div>
        </div>
    );
}

export default WorkerDashboardPage;