import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // <-- ¡Importar toast!
import './LoginPage.css';

function LoginPage({ onLogin }) { // onLogin es la función de App.js que maneja el éxito y el toast.success
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Lo mantendremos para errores internos o detallados si no se usa toast
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpiar el mensaje de error en la página
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
                // El campo 'username' viene del backend AuthResponse.
                // Si el backend AuthResponse no tiene 'username', podrías usar el email como fallback.
                const userName = response.data.username || email;
                let userRole = response.data.role || 'USER'; // <-- Obtener el rol del backend si viene

                // Si por alguna razón el rol no viene del backend, podrías tener tu lógica de fallback aquí
                if (!response.data.role && email.endsWith('@ferremax.com')) {
                    userRole = 'WORKER';
                }

                // onLogin (de App.js) maneja el almacenamiento en localStorage y muestra el toast.success
                onLogin(accessToken, userName, userRole);

                // Redireccionar según el rol
                if (userRole === 'WORKER' || userRole === 'ADMIN') { // Asumo que ADMIN también va al dashboard
                    navigate('/worker-dashboard');
                } else {
                    navigate('/profile'); // Redirige a /profile si es un usuario normal
                }

            } else {
                // Este caso es inusual si la respuesta es 200 OK pero falta el token
                const msg = 'La respuesta del servidor fue exitosa, pero no se encontró el token de autenticación.';
                setErrorMessage(msg); // Muestra el mensaje en la página
                toast.error(msg); // También como toast
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            let displayMessage = 'Ocurrió un error inesperado al intentar iniciar sesión.';

            if (error.response) {
                // Error del servidor (ej. 401 Unauthorized, 400 Bad Request)
                console.error('Datos del error (respuesta del servidor):', error.response.data);
                console.error('Estado HTTP del error:', error.response.status);
                // Intenta usar el mensaje del backend si está disponible
                displayMessage = error.response.data.message || 'Error de credenciales o de servidor.';
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta (ej. servidor caído, CORS)
                displayMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet o el estado del backend.';
            } else {
                // Otros errores (ej. error en la configuración de la petición)
                displayMessage = 'Ocurrió un error al preparar la solicitud de inicio de sesión.';
            }

            setErrorMessage(displayMessage); // Muestra el mensaje en la página
            toast.error(displayMessage); // Muestra el mensaje como toast

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
                    {/* El errorMessage se muestra aquí si no quieres solo toasts */}
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