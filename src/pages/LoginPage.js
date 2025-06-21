// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- ¡Importa axios!
import './LoginPage.css';

// El componente LoginPage ahora recibirá la prop onLogin
function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error al usuario
    const navigate = useNavigate();

    const handleSubmit = async (e) => { // <-- ¡Añade 'async' aquí!
        e.preventDefault();
        setErrorMessage(''); // Limpia cualquier mensaje de error anterior

        try {
            console.log('Intentando iniciar sesión con:', { email, password });

            // Realiza la llamada HTTP POST al backend
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });

            console.log('Respuesta completa del login desde el backend:', response);

            // Verifica si la respuesta contiene el token de acceso
            if (response.data && response.data.accessToken) {
                const accessToken = response.data.accessToken;
                const userName = response.data.username || email; // Usa el nombre de usuario del backend o el email

                // Llama a la función onLogin pasada desde App.js, pasándole el token y el nombre
                onLogin(accessToken, userName);

                alert('¡Inicio de sesión exitoso!');
                navigate('/profile'); // Redirige a la página de perfil
            } else {
                // Si la respuesta fue exitosa (status 200) pero no hay token
                setErrorMessage('La respuesta del servidor fue exitosa, pero no se encontró el token de autenticación.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                // El servidor respondió con un status diferente de 2xx
                // Por ejemplo, 401 Unauthorized, 400 Bad Request, etc.
                setErrorMessage(error.response.data.message || 'Error de credenciales o de servidor.');
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta (ej. red caída, CORS mal configurado)
                setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else {
                // Algo más sucedió al configurar la solicitud
                setErrorMessage('Error inesperado al intentar iniciar sesión.');
            }
        }
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
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra el mensaje de error */}
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