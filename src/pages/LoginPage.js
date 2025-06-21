// src/pages/LoginPage.js

import React, { useState } from 'react';
// Importa el CSS específico para esta página. Se asume que está en la misma carpeta.
import './LoginPage.css';

function LoginPage() {
    // Estados para almacenar el valor del email y la contraseña
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        console.log('Intentando iniciar sesión con:');
        console.log('Email:', email);
        console.log('Contraseña:', password);
        // Aquí es donde, en el futuro, conectarás con tu API de backend para autenticar al usuario.
        // Por ahora, solo mostraremos una alerta.
        alert('Inicio de sesión simulado para: ' + email);

        // Opcional: Limpiar los campos después de enviar
        // setEmail('');
        // setPassword('');
    };

    return (
        <div className="login-page-container">
            <div className="login-form-card">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado cuando el input cambia
                            required // Hace que el campo sea obligatorio
                            placeholder="tu@correo.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando el input cambia
                            required // Hace que el campo sea obligatorio
                            placeholder="********"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>
                </form>
                <p className="register-link">
                    ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;