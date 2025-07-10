import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <-- ¡Importar toast!
import './RegisterPage.css';
import AuthService from '../../services/AuthService'; // Asegúrate de que la ruta sea correcta

function RegisterPage() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Eliminamos 'message' ya que los mensajes se manejarán con toastify
    // const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Limpiamos el estado 'message' aunque ya no lo usaremos para los toasts
        // setMessage('');

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden. Por favor, verifica.'); // <-- Mensaje de error con toast
            return;
        }

        try {
            const responseText = await AuthService.register(username, email, password, name, lastName);

            // Mensaje de éxito con toast
            toast.success('¡Registro exitoso! ' + responseText);
            console.log('Registro exitoso:', responseText);

            // Redirige al usuario a la página de login después de un pequeño retraso
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirige después de 2 segundos

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            // Mensaje de error con toast
            toast.error('Error al registrar: ' + (error.message || 'Error desconocido'));
            // setLoggerMessage('Error al registrar: ' + error.message); // Si quieres mantener algún log interno o estado de error
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-form-card">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Tu Nombre"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Apellido:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tu Apellido"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="nombredeusuario"
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
                {/* Eliminamos la visualización del 'message' ya que ahora usaremos toastify */}
                {/* {message && <p className="registration-message">{message}</p>} */}
                <p className="login-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
                </p>
                <p className="back-to-home-link">
                    <Link to="/" className="back-button">Volver a Inicio</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;