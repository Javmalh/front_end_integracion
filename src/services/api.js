import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('jwtToken');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export const getProducts = (params) => {
    console.log('API: Obteniendo productos con parámetros:', params);
    return api.get('/products', { params });
};

export const createProduct = (productData) => {
    console.log('API: Creando producto. Datos enviados a backend (incluyendo imageUrl):', productData);
    console.log('API: Valor de imageUrl enviado para creación:', productData.imageUrl);
    return api.post('/products', productData);
};

export const updateProduct = (id, productData) => {
    console.log('API: Actualizando producto ID:', id, 'con datos:', productData);
    console.log('API: Valor de imageUrl enviado para actualización:', productData.imageUrl);
    return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
    console.log('API: Eliminando producto ID:', id);
    return api.delete(`/products/${id}`);
};

export const getAllProductCategories = () => {
    console.log('API: Obteniendo todas las categorías de productos...');
    return api.get('/products/categories');
};

export const getUserProfile = () => {
    console.log('API: Obteniendo perfil de usuario...');
    return api.get('/users/profile');
};

export default api;