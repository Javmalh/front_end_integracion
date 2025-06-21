// src/pages/RegisterPage.js

import React, { useState } from 'react';
// Importa el CSS específico para esta página. Se asume que está en la misma carpeta.
import './RegisterPage.css';

function RegisterPage() {
    // Estados para almacenar los valores de los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Validación simple de contraseña
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, verifica.');
            return; // Detiene la función si las contraseñas no coinciden
        }

        console.log('Intentando registrar usuario:');
        console.log('Nombre:', name);
        console.log('Correo Electrónico:', email);
        console.log('Contraseña:', password);
        // Aquí es donde, en el futuro, conectarás con tu API de backend para registrar al usuario.
        // Por ahora, solo mostraremos una alerta.
        alert('Registro simulado para: ' + email);

        // Opcional: Limpiar los campos después de enviar
        // setName('');
        // setEmail('');
        // setPassword('');
        // setConfirmPassword('');
    };

    return (
        <div className="register-page-container">
            <div className="register-form-card">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Tu Nombre Apellido"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@correo.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Registrarse
                    </button>
                </form>
                <p className="login-link">
                    ¿Ya tienes cuenta? <a href="/login">Inicia Sesión aquí</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
