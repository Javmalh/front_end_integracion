import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import './UserProfilePage.css';

function UserProfilePage({ onProfileUpdate }) {

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error("Error al formatear fecha:", dateString, e);
            return dateString;
        }
    };


    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            console.log("UserProfilePage: Token JWT en localStorage:", jwtToken ? "Token presente" : "Token NO presente");

            if (!jwtToken) {
                setLoading(false);
                setUserProfile(null);
                return;
            }


            const response = await api.get('/users/profile');
            setUserProfile(response.data);
            console.log("UserProfilePage: Perfil de usuario cargado:", response.data);


            if (onProfileUpdate && response.data.name) {
                onProfileUpdate(response.data.name);
            }
        } catch (err) {
            console.error('UserProfilePage: Error al cargar el perfil:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Acceso no autorizado. Por favor, inicia sesión para ver tu perfil.');
                } else {
                    setError(err.response.data.message || 'Error al cargar el perfil desde el servidor.');
                }
            } else {
                setError('No se pudo cargar el perfil del usuario. Verifique su conexión o intente de nuevo.');
            }
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    }, [onProfileUpdate]);



    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    if (loading) {
        return (
            <div className="user-profile-container">
                <div className="user-profile-card">
                    <h2>Cargando perfil...</h2>
                    <p>Por favor, espere.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile-container">
                <div className="user-profile-card">
                    <h2>Error al cargar el perfil</h2>
                    <p className="error-message" style={{ color: 'red' }}>{error}</p>
                    <Link to="/login" className="profile-action-link">Iniciar Sesión</Link>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="user-profile-container">
                <div className="user-profile-card">
                    <h2>Perfil no disponible</h2>
                    <p>No se pudieron obtener los datos de su perfil. Por favor, intente iniciar sesión nuevamente.</p>
                    <Link to="/login" className="profile-action-link">Iniciar Sesión</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                <h2>¡Bienvenido, {userProfile.name || userProfile.username}!</h2>
                <p className="welcome-message">
                    Este es tu panel de usuario. Aquí puedes gestionar tu información y tus pedidos.
                </p>

                <div className="profile-details">
                    <h3>Detalles de la Cuenta</h3>
                    <p><strong>Nombre:</strong> {userProfile.name || userProfile.username}</p>
                    <p><strong>Apellido:</strong> {userProfile.lastName || 'N/A'}</p>
                    <p><strong>Correo Electrónico:</strong> {userProfile.email}</p>
                    {userProfile.memberSince && (
                        <p>
                            <strong>Miembro desde:</strong>{' '}
                            {new Date(userProfile.memberSince).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                    <p>
                        <strong>Roles:</strong> {userProfile.roles && Array.isArray(userProfile.roles) && userProfile.roles.length > 0
                        ? userProfile.roles.map(role => role.replace('ROLE_', '')).join(', ')
                        : 'N/A'}
                    </p>
                </div>

                <div className="profile-actions">
                    <h3>Tus Acciones</h3>
                    <ul>
                        <li><Link to="/my-orders" className="profile-action-link">Ver mis pedidos</Link></li>
                        <li><Link to="/my-transactions" className="profile-action-link">Ver mis pagos</Link></li>
                        <li><Link to="/settings" className="profile-action-link">Configuración de Cuenta</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;