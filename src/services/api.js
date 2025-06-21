import axios from 'axios';

// La URL base de tu backend de Spring Boot
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

// --- Métodos de Autenticación (Auth) ---
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// --- Métodos de Productos ---
export const getProducts = () => api.get('/producto/{id}');
// export const getProductById = (id) => api.get(`/productos/${id}`); // Si tuvieras un endpoint para un solo producto
// export const createProduct = (productData) => api.post('/productos', productData);
// export const updateProduct = (id, productData) => api.put(`/productos/${id}`, productData);
// export const deleteProduct = (id) => api.delete(`/productos/${id}`);


// --- Métodos de Órdenes ---
export const getOrders = () => api.get('/ordenes');
export const getOrdersByBranch = (branchName) => api.get(`/ordenes?sucursal=${branchName}`);
export const createOrder = (orderData) => api.post('/ordenes', orderData);
// export const updateOrder = (id, orderData) => api.put(`/ordenes/${id}`, orderData); // Si tuvieras un PUT para ordenes
// export const deleteOrder = (id) => api.delete(`/ordenes/${id}`); // Si tuvieras un DELETE para ordenes


// --- Métodos de Pagos (Payment) ---
export const createPayment = (paymentData) => api.post('/payment/create', paymentData);
export const listPayments = () => api.get('/payment/list');

export default api;