import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Asegúrate de que la ruta de tu CSS sea correcta
import AuthService from '../../services/AuthService'; // Asegúrate de que la ruta de tu AuthService sea correcta

function RegisterPage() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // Estado para el nombre de usuario
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); // Para mostrar mensajes al usuario

    const navigate = useNavigate(); // Hook para la navegación programática

    /**
     * Maneja el envío del formulario de registro.
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => { // Marca la función como async
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        setMessage(''); // Limpia mensajes anteriores

        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden. Por favor, verifica.');
            return;
        }

        try {
            // Llama al servicio de registro con todos los datos del formulario
            const responseText = await AuthService.register(username, email, password, name, lastName);

            // Si el registro es exitoso, muestra un mensaje y redirige al login
            setMessage('¡Registro exitoso! ' + responseText + ' Redirigiendo a la página de inicio de sesión...');
            console.log('Registro exitoso:', responseText);

            // Redirige al usuario a la página de login después de un pequeño retraso
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirige después de 2 segundos

        } catch (error) {
            // Captura y muestra cualquier error que ocurra durante el registro
            console.error('Error al registrar usuario:', error);
            setMessage('Error al registrar: ' + error.message);
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
                {/* Muestra los mensajes de éxito o error al usuario */}
                {message && <p className="registration-message">{message}</p>}
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