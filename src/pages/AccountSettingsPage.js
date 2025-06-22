import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSettingsPage.css';
import api from '../services/api'; // Importa la instancia de Axios configurada

function AccountSettingsPage({ onProfileUpdate }) { // onProfileUpdate es una prop para actualizar el nombre global
    const navigate = useNavigate();

    // Estados para la información actual del usuario (se cargarán desde la API)
    const [currentName, setCurrentName] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    // Estados para los campos de los formularios
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [loadingProfile, setLoadingProfile] = useState(true); // Para el estado de carga inicial del perfil
    const [message, setMessage] = useState(''); // Para mostrar mensajes de éxito
    const [error, setError] = useState(''); // Para mostrar mensajes de error

    // Cargar la información actual del perfil al montar el componente
    useEffect(() => {
        const fetchCurrentProfile = async () => {
            setLoadingProfile(true);
            setError(''); // Limpiar errores anteriores
            try {
                const response = await api.get('/users/profile'); // Obtener el perfil del backend
                setCurrentName(response.data.name);
                setCurrentEmail(response.data.email);
                setNewName(response.data.name); // Inicializar el campo del formulario con el nombre actual
                setNewEmail(response.data.email); // Inicializar el campo del formulario con el email actual
            } catch (err) {
                console.error('Error al cargar la información del perfil:', err);
                setError('No se pudo cargar la información del perfil. Intente de nuevo.');
                // Si el token es inválido, el interceptor de api.js debería manejar la redirección.
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchCurrentProfile();
    }, []); // Se ejecuta una vez al montar el componente

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpiar mensajes anteriores
        setError(''); // Limpiar errores anteriores

        // Validación básica en el frontend
        if (!newName.trim() || !newEmail.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const response = await api.put('/users/profile', { // Envía la actualización al backend
                name: newName,
                email: newEmail,
            });
            setMessage('¡Perfil actualizado exitosamente!');
            setCurrentName(newName); // Actualiza el estado local
            setCurrentEmail(newEmail); // Actualiza el estado local

            // Si se proporciona la función onProfileUpdate (desde App.js), la llamamos para actualizar el nombre global
            if (onProfileUpdate) {
                onProfileUpdate(newName);
            }

        } catch (err) {
            console.error('Error al actualizar el perfil:', err);
            if (err.response && err.response.data) {
                // Si el backend envía un mensaje de error específico (ej. email ya registrado)
                setError(err.response.data);
            } else {
                setError('Error al actualizar el perfil. Intente de nuevo.');
            }
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(''); // Limpiar mensajes anteriores
        setError(''); // Limpiar errores anteriores

        // Validación básica en el frontend
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Por favor, completa todos los campos de contraseña.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('La nueva contraseña y su confirmación no coinciden.');
            return;
        }
        if (newPassword.length < 6) { // Ejemplo de validación de longitud (ajusta según tu backend)
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (currentPassword === newPassword) {
            setError('La nueva contraseña no puede ser igual a la actual.');
            return;
        }

        try {
            await api.put('/users/password', { // Envía la solicitud de cambio de contraseña al backend
                currentPassword,
                newPassword,
            });
            setMessage('¡Contraseña cambiada exitosamente!');
            // Limpiar los campos después de un cambio exitoso
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            console.error('Error al cambiar la contraseña:', err);
            if (err.response && err.response.data) {
                // Si el backend envía un mensaje de error específico (ej. contraseña actual incorrecta)
                setError(err.response.data);
            } else {
                setError('Error al cambiar la contraseña. Intente de nuevo.');
            }
        }
    };

    // Muestra un mensaje de carga mientras se obtienen los datos del perfil
    if (loadingProfile) {
        return (
            <div className="account-settings-page-container">
                <div className="account-settings-card">
                    <h2>Cargando configuración...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="account-settings-page-container">
            <div className="account-settings-card">
                <h2>Configuración de la Cuenta</h2>

                {/* Mensajes de éxito y error */}
                {message && (
                    <p className={`settings-message ${message.includes('exitosamente') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
                {error && <p className="settings-message error">{error}</p>}

                <div className="settings-section">
                    <h3>Actualizar Información Personal</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo:</label>
                            <input
                                type="text"
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="settings-button primary">
                            Guardar Cambios
                        </button>
                    </form>
                </div>

                <div className="settings-section">
                    <h3>Cambiar Contraseña</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label htmlFor="current-password">Contraseña Actual:</label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="new-password">Nueva Contraseña:</label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-new-password">Confirmar Nueva Contraseña:</label>
                            <input
                                type="password"
                                id="confirm-new-password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="settings-button secondary">
                            Cambiar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountSettingsPage;