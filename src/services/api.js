import axios from 'axios';

// URL base de tu API de Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

// Función para obtener el token JWT del almacenamiento local (o de donde lo guardes)
const getToken = () => localStorage.getItem('jwtToken');

// Configuración de una instancia de Axios con la URL base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token de autorización a cada petición saliente
api.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// --- Funciones de la API para Productos ---

export const getProducts = (params) => {
    console.log('API: Obteniendo productos con parámetros:', params);
    return api.get('/products', { params });
};

export const createProduct = (productData) => {
    console.log('API: Creando producto. Datos enviados a backend (incluyendo imageUrl):', productData);
    console.log('API: Valor de imageUrl enviado para creación:', productData.imageUrl); // ¡CRÍTICO! Observa este log
    return api.post('/products', productData);
};

export const updateProduct = (id, productData) => {
    console.log('API: Actualizando producto ID:', id, '. Datos enviados a backend (incluyendo imageUrl):', productData);
    console.log('API: Valor de imageUrl enviado para actualización:', productData.imageUrl); // ¡CRÍTICO! Observa este log
    return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
    console.log('API: Eliminando producto ID:', id);
    return api.delete(`/products/${id}`);
};

// --- Función de la API para Categorías ---
export const getAllProductCategories = () => {
    console.log('API: Obteniendo todas las categorías de productos...');
    return api.get('/products/categories');
};

// --- Función de la API para Perfil de Usuario ---
export const getUserProfile = () => {
    console.log('API: Obteniendo perfil de usuario...');
    return api.get('/users/profile');
};

export default api;