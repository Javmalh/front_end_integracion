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
                // Si la respuesta no es OK (ej. 400 Bad Request, 409 Conflict, 500 Internal Server Error),
                // intenta leer el mensaje de error del backend.
                // Asumimos que el backend podría enviar JSON con un campo 'message' para errores,
                // pero si no puede parsearse como JSON, usamos el estado de la respuesta.
                return response.json().then(errorData => {
                    // Si el backend envía un mensaje de error en un JSON (ej. de un @ControllerAdvice), úsalo
                    throw new Error(errorData.message || response.statusText || 'Error desconocido del servidor');
                }).catch(jsonError => {
                    // Si la respuesta no es JSON (ej. es texto plano de error del servidor de aplicaciones),
                    // o si hay un problema al parsear el JSON de error, intentamos obtener el texto completo.
                    // Esto es una mejora para depuración, pero para producción, se podría preferir un mensaje genérico.
                    return response.text().then(textError => {
                        console.error("Error al parsear JSON de error o respuesta no JSON:", jsonError, "Texto de respuesta:", textError);
                        throw new Error(textError || response.statusText || 'Error desconocido del servidor');
                    });
                });
            }
            // --- CAMBIO CLAVE AQUÍ: Esperar texto en lugar de JSON para la respuesta de ÉXITO ---
            // Tu backend para /register devuelve un String ("Usuario registrado exitosamente!")
            return response.text();
        });
};

const AuthService = {
    register,
    // Aquí se pueden añadir otros métodos relacionados con la autenticación, como login, logout, etc.
};

export default AuthService;