import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            console.log('Intentando iniciar sesión con:', { email, password });

            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });

            console.log('Respuesta completa del login desde el backend:', response);

            if (response.data && response.data.accessToken) {
                const accessToken = response.data.accessToken;
                const userName = response.data.username || email;
                let userRole = 'USER';

                if (email.endsWith('@ferremax.com')) {
                    userRole = 'WORKER';
                }

                onLogin(accessToken, userName, userRole);

                if (userRole === 'WORKER') {
                    navigate('/worker-dashboard');
                } else {
                    navigate('/profile');
                }

            } else {
                setErrorMessage('La respuesta del servidor fue exitosa, pero no se encontró el token de autenticación.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.response) {
                console.error('Datos del error (respuesta del servidor):', error.response.data);
                console.error('Estado HTTP del error:', error.response.status);
                setErrorMessage(error.response.data.message || 'Error de credenciales o de servidor.');
            } else if (error.request) {
                setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión a internet o el estado del backend.');
            } else {
                setErrorMessage('Ocurrió un error inesperado al intentar iniciar sesión.');
            }
        } finally {
            setLoading(false);
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <p className="register-link">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
                <p className="back-to-home-link">
                    <Link to="/" className="back-button">Volver a Inicio</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;