// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ¡Asegúrate de que axios esté instalado: npm install axios o yarn add axios!
import './LoginPage.css';

// El componente LoginPage espera recibir la prop onLogin desde App.js
function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mostrar mensajes de error
    const [loading, setLoading] = useState(false); // Nuevo estado para indicar carga
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpia cualquier mensaje de error anterior
        setLoading(true); // Activa el estado de carga

        try {
            console.log('Intentando iniciar sesión con:', { email, password });

            // Realiza la llamada HTTP POST al backend usando axios
            // La URL base ya está configurada en api.js, por lo que aquí solo la ruta del endpoint
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email, // Asegúrate que tu DTO de login en Spring Boot espere 'email'
                password
            });

            console.log('Respuesta completa del login desde el backend:', response);

            // Verifica si la respuesta contiene el token de acceso
            // axios envuelve la respuesta del servidor en 'response.data'
            if (response.data && response.data.accessToken) {
                const accessToken = response.data.accessToken;
                // Asume que el backend podría enviar un 'username', si no, usa el email como fallback
                const userName = response.data.username || email;

                // Llama a la función onLogin pasada desde App.js para actualizar el estado global
                onLogin(accessToken, userName);

                // No es necesario un alert si vas a redirigir.
                // alert('¡Inicio de sesión exitoso!');

                // Redirige al usuario a la página de perfil (o a la que desees después del login)
                navigate('/profile');
            } else {
                // Si la respuesta fue 200 OK pero por alguna razón no se encontró el token en 'data.accessToken'
                setErrorMessage('La respuesta del servidor fue exitosa, pero no se encontró el token de autenticación.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                // El servidor respondió con un status fuera del rango 2xx (ej: 400, 401, 403, 404, 500)
                console.error('Datos del error (respuesta del servidor):', error.response.data);
                console.error('Estado HTTP del error:', error.response.status);
                setErrorMessage(error.response.data.message || 'Error de credenciales o de servidor.');
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta (ej. red caída, CORS mal configurado)
                setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión a internet o el estado del backend.');
            } else {
                // Algo más sucedió al configurar la solicitud o procesar la respuesta
                setErrorMessage('Ocurrió un error inesperado al intentar iniciar sesión.');
            }
        } finally {
            setLoading(false); // Desactiva el estado de carga
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
                            disabled={loading} // Deshabilita el input mientras carga
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
                            disabled={loading} // Deshabilita el input mientras carga
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Muestra el mensaje de error */}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
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