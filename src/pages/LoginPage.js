// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación programática
import './LoginPage.css';

// El componente LoginPage ahora recibe la prop onLogin
function LoginPage({ onLogin }) {
    // Estados para almacenar el valor del email y la contraseña
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para obtener la función de navegación

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        console.log('Intentando iniciar sesión con:');
        console.log('Email:', email);
        console.log('Contraseña:', password);

        // Llama a la función onLogin pasada desde App.js
        // Esta función manejará la lógica de autenticación real (simulada aquí)
        // y retornará true si es exitosa, false si falla.
        const loginSuccessful = onLogin(email, password);

        if (loginSuccessful) {
            // Si el login fue exitoso, redirige al usuario a la página de perfil
            navigate('/profile');
        } else {
            // Si el login falló, la alerta ya es manejada por onLogin en App.js
            // Puedes añadir lógica adicional aquí si es necesario (ej. limpiar campos)
        }

        // Opcional: Limpiar los campos después de intentar iniciar sesión (independientemente del éxito)
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
