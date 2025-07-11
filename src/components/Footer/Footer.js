import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section footer-about">
                    <h3>FerreMax</h3>
                    <p>Tu aliado confiable para todas tus necesidades de herramientas y materiales de construcción.</p>
                </div>

                <div className="footer-section footer-links">
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Productos</Link></li>
                        <li><Link to="/ofertas">Ofertas</Link></li>
                        <li><Link to="/sucursales">Sucursales</Link></li>
                        {}
                        <li><Link to="/politica-privacidad">Política de Privacidad</Link></li>
                        <li><Link to="/terminos-condiciones">Términos y Condiciones</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-contact">
                    <h3>Contáctanos</h3>
                    <p>Dirección: Av. Principal 123, Valparaíso, Chile</p>
                    <p>Teléfono: +56 9 1234 5678</p>
                    <p>Email: ferremaxplus2025@gmail.com</p>
                    <p>Horario: Lun-Vie: 8am - 6pm</p>
                </div>

                <div className="footer-section footer-social">
                    <h3>Síguenos</h3>
                    <div className="social-icons">
                        <a href="https://web.facebook.com/profile.php?id=61577413776150" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://x.com/max_ferre2357" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com/ferremax_plus/" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} FerreMax. Todos los derechos reservados.</p>
                {}
                <p><Link to="/politica-privacidad">Política de Privacidad</Link> | <Link to="/terminos-condiciones">Términos y Condiciones</Link></p>
            </div>
        </footer>
    );
}

export default Footer;