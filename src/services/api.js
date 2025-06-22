// src/main/js/src/services/api.js

import axios from 'axios';

// La URL base de tu backend de Spring Boot. Asegúrate de que sea la correcta.
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token JWT a cada petición
// Suponiendo que guardas el token JWT en localStorage después del login
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // O donde sea que guardes tu token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRedirecting = false; // Flag para evitar múltiples redirecciones al detectar 401

// Interceptor para manejar errores de respuesta, especialmente 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el error es 401 Unauthorized (token expirado, inválido, o no enviado)
        // Y no estamos ya en proceso de redirección
        if (error.response && error.response.status === 401 && !isRedirecting) {
            isRedirecting = true; // Activa el flag para evitar redirecciones repetidas
            console.warn("Token JWT expirado o no autorizado. Redirigiendo al login.");
            // 1. Elimina el token inválido del almacenamiento local
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userName'); // Limpia también el nombre
            localStorage.removeItem('userRole'); // Limpia también el rol
            // 2. Redirige al usuario a la página de login después de un pequeño retraso
            //    para que el mensaje de advertencia se vea en la consola.
            window.location.href = '/login'; // Ajusta esto si tu ruta de login es diferente
            // No reseteamos isRedirecting aquí, se reiniciará con una nueva sesión de página
            // o con un manual reset si fuera necesario en una SPA más compleja.
        }
        return Promise.reject(error);
    }
);

// --- Métodos de Autenticación (Auth) ---
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// --- Métodos de Productos ---
export const getProducts = () => api.get('/productos');
export const getProductById = (id) => api.get(`/productos/${id}`);

// --- Métodos de Órdenes ---
export const getOrders = () => api.get('/ordenes');
export const getOrdersByBranch = (branchName) => api.get(`/ordenes?sucursal=${branchName}`);
export const createOrder = (orderData) => api.post('/ordenes', orderData);

// --- Métodos de Pagos (Payment) ---
export const createPayment = (paymentData) => api.post('/payment/create', paymentData);
export const listPayments = () => api.get('/payment/list');

// --- Métodos de Usuarios (User) ---
export const getUserProfile = () => api.get('/users/profile'); // Asegúrate de que esta línea esté presente
export const updateProfile = (profileData) => api.put('/users/profile', profileData);
export const changePassword = (passwordData) => api.put('/users/password', passwordData);

export default api;