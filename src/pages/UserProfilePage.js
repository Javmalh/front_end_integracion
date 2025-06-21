// src/pages/UserProfilePage.js

import React from 'react';
import './UserProfilePage.css'; // Importa el CSS específico para esta página

// Este componente representará la vista del usuario logeado
function UserProfilePage({ userName = 'Usuario' }) { // Recibe el nombre de usuario como prop
    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                <h2>¡Bienvenido, {userName}!</h2> {/* Muestra el nombre del usuario */}
                <p>Este es tu panel de usuario. Aquí puedes gestionar tu información y tus pedidos.</p>

                <div className="profile-details">
                    <h3>Detalles de la Cuenta</h3>
                    <p><strong>Nombre:</strong> {userName}</p>
                    <p><strong>Correo Electrónico:</strong> usuario@ferremax.com</p> {/* Correo de ejemplo */}
                    <p><strong>Miembro desde:</strong> Enero 2023</p> {/* Fecha de ejemplo */}
                </div>

                <div className="profile-actions">
                    <h3>Tus Acciones</h3>
                    <ul>
                        <li><a href="/orders">Ver mis pedidos</a></li> {/* Enlace a pedidos (futura página) */}
                        <li><a href="/settings">Configuración de la cuenta</a></li> {/* Enlace a configuración (futura página) */}
                        <li><button className="logout-button" onClick={() => alert('¡Has cerrado sesión!')}>Cerrar Sesión</button></li> {/* Botón para cerrar sesión */}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;