import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfilePage.css'; // Asegúrate de que este archivo CSS existe
import { getUserProfile } from '../services/api'; // Importa la función específica

function UserProfilePage({ onProfileUpdate }) {
    const [userDetails, setUserDetails] = useState({
        name: 'Cargando...',
        email: 'Cargando...',
        memberSince: null, // Inicializa como null, esperando un objeto Date o string de fecha
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para la navegación programática

    // Usa useCallback para memoizar fetchUserProfile para el useEffect
    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('jwtToken'); // Obtener el token del localStorage

        if (!token) {
            // Si no hay token, el usuario no está autenticado, no intentes cargar
            setError("No hay usuario autenticado. Por favor, inicie sesión.");
            setLoading(false);
            setUserDetails({ name: 'Invitado', email: '', memberSince: null }); // Estado para no autenticado
            // Opcional: Podrías redirigir al login aquí si la ruta del perfil es estrictamente protegida
            // navigate('/login'); // El interceptor ya debería hacer esto para 401
            return;
        }

        try {
            const response = await getUserProfile(); // Llama a la función del servicio
            setUserDetails({
                name: response.data.name,
                email: response.data.email,
                memberSince: response.data.memberSince, // Espera un Date o string de fecha del backend
            });
            // Si el nombre del perfil cambia en el backend, actualiza el estado global si es necesario
            if (onProfileUpdate && response.data.name !== userDetails.name) {
                onProfileUpdate(response.data.name);
            }
        } catch (err) {
            console.error('Error al cargar el perfil:', err.response ? err.response.data : err.message);
            // El interceptor de api.js ya debería manejar el 401 y redirigir.
            // Aquí manejamos otros posibles errores de la API.
            if (err.response) {
                if (err.response.status === 404) {
                    setError(`Error: Perfil no encontrado. ${err.response.data || ''}`);
                } else if (err.response.status === 500) {
                    setError(`Error interno del servidor: ${err.response.data || 'Intente más tarde.'}`);
                } else {
                    setError(`Error al cargar el perfil del usuario: ${err.response.data?.message || err.message}.`);
                }
            } else {
                setError('No se pudo cargar el perfil del usuario. Verifique su conexión o intente de nuevo.');
            }
            setUserDetails({ // Resetea a valores por defecto o de error en caso de fallo
                name: 'Error',
                email: 'Error',
                memberSince: null,
            });
        } finally {
            setLoading(false);
        }
    }, [onProfileUpdate, userDetails.name]); // Dependencias para useCallback

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]); // Dependencia del useEffect

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
                    <p style={{ color: 'red' }}>{error}</p>
                    <Link to="/" className="profile-action-link">Volver al Inicio</Link>
                </div>
            </div>
        );
    }

    // Si userDetails.email es nulo o vacío después de cargar (sin un error explícito),
    // significa que no se cargaron los datos.
    if (!userDetails.email) {
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
                <h2>¡Bienvenido, {userDetails.name}!</h2>
                <p className="welcome-message">
                    Este es tu panel de usuario. Aquí puedes gestionar tu información y tus pedidos.
                </p>

                <div className="profile-details">
                    <h3>Detalles de la Cuenta</h3>
                    <p><strong>Nombre:</strong> {userDetails.name}</p>
                    <p><strong>Correo Electrónico:</strong> {userDetails.email}</p>
                    {/* Solo muestra "Miembro desde" si el dato existe */}
                    {userDetails.memberSince && (
                        <p>
                            <strong>Miembro desde:</strong>{' '}
                            {new Date(userDetails.memberSince).toLocaleDateString('es-CL', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                </div>

                <div className="profile-actions">
                    <h3>Tus Acciones</h3>
                    <ul>
                        <li><Link to="/orders" className="profile-action-link">Ver mis pedidos</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;