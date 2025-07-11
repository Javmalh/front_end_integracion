// src/services/AuthService.js

const API_URL = 'http://localhost:8080/api/auth/'; // Ajusta esta URL a la de tu backend de Spring Boot

/**
 * Registra un nuevo usuario en el sistema.
 * @param {string} username - Nombre de usuario del nuevo usuario.
 * @param {string} email - Correo electrónico del nuevo usuario.
 * @param {string} password - Contraseña del nuevo usuario.
 * @param {string} name - Nombre del nuevo usuario.
 * @param {string} lastName - Apellido del nuevo nuevo usuario.
 * @returns {Promise<string>} Promesa que resuelve con un mensaje de éxito (texto plano) o rechaza con un error.
 */
const register = (username, email, password, name, lastName) => {
    return fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name, lastName }),
    })
        .then(response => {
            if (!response.ok) {

                return response.json().then(errorData => {

                    throw new Error(errorData.message || response.statusText || 'Error desconocido del servidor');
                }).catch(jsonError => {
                    return response.text().then(textError => {
                        console.error("Error al parsear JSON de error o respuesta no JSON:", jsonError, "Texto de respuesta:", textError);
                        throw new Error(textError || response.statusText || 'Error desconocido del servidor');
                    });
                });
            }
            return response.text();
        });
};

const AuthService = {
    register,
};

export default AuthService;