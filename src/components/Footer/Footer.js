import React from 'react';
import './Footer.css'; // Esto es correcto, ya que el CSS del footer está en la misma carpeta

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Columna 1: Logo y descripción (opcional) */}
                <div className="footer-section footer-about">
                    <h3>FerreMax</h3>
                    <p>Tu aliado confiable para todas tus necesidades de herramientas y materiales de construcción.</p>
                    {/* Puedes añadir un logo aquí si quieres */}
                    {/* <img src={logoFooter} alt="FerreMax Logo" className="footer-logo" /> */}
                </div>

                {/* Columna 2: Enlaces útiles */}
                <div className="footer-section footer-links">
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><a href="#home">Inicio</a></li>
                        <li><a href="#products">Productos</a></li>
                        <li><a href="#offers">Ofertas</a></li>
                        <li><a href="#branches">Sucursales</a></li>
                        <li><a href="#contact">Contacto</a></li>
                    </ul>
                </div>

                {/* Columna 3: Información de contacto */}
                <div className="footer-section footer-contact">
                    <h3>Contáctanos</h3>
                    <p>Dirección: Av. Principal 123, Valparaíso, Chile</p>
                    <p>Teléfono: +56 9 1234 5678</p>
                    <p>Email: ferremaxplus2025@gmail.com</p>
                    <p>Horario: Lun-Vie: 9am - 6pm</p>
                </div>

                {/* Columna 4: Redes sociales (iconos opcionales) */}
                <div className="footer-section footer-social">
                    <h3>Síguenos</h3>
                    <div className="social-icons">
                        <a href="https://web.facebook.com/profile.php?id=61577413776150" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i> {/* Icono de Facebook */}
                        </a>
                        <a href="https://x.com/max_ferre2357" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i> {/* Icono de Twitter */}
                        </a>
                        <a href="https://www.instagram.com/ferremax_plus/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i> {/* Icono de Instagram */}
                        </a>
                        {/* Necesitarás una librería de iconos como Font Awesome */}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} FerreMax. Todos los derechos reservados.</p>
                <p><a href="#privacy">Política de Privacidad</a> | <a href="#terms">Términos y Condiciones</a></p>
            </div>
        </footer>
    );
}

export default Footer;