import React from 'react';
import { Link } from 'react-router-dom';
import './StaticContentPage.css';

function PrivacyPolicyPage() {
    return (
        <div className="static-content-page-container">
            <h1 className="static-content-title">Política de Privacidad de FerreMax</h1>
            <div className="static-content-text">
                <p><strong>Fecha de última actualización:</strong> 10 de julio de 2025</p>

                <p>En FerreMax, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo FerreMax ("nosotros", "nuestro", "la Compañía") recopila, utiliza y comparte tu información personal cuando visitas nuestro sitio web, utilizas nuestros servicios o interactúas con nosotros de cualquier otra manera.</p>

                <h3>1. Información que Recopilamos</h3>
                <p>Recopilamos información para proporcionarte una mejor experiencia y servicio. Los tipos de información que podemos recopilar incluyen:</p>
                <ul>
                    <li><strong>Información de Contacto:</strong> Nombre, apellido, dirección de correo electrónico, número de teléfono.</li>
                    <li><strong>Información de Cuenta:</strong> Nombre de usuario, contraseña (encriptada), fecha de registro.</li>
                    <li><strong>Información de Transacción:</strong> Detalles sobre productos que compras, montos, sucursales de compra, información de pago (a través de pasarelas de pago de terceros como Transbank, nosotros no almacenamos directamente tu información de tarjeta de crédito).</li>
                    <li><strong>Información de Uso del Sitio:</strong> Dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo en el sitio, clics.</li>
                </ul>

                <h3>2. Cómo Utilizamos tu Información</h3>
                <p>Utilizamos la información recopilada para diversos fines, que incluyen:</p>
                <ul>
                    <li>Procesar tus pedidos y transacciones.</li>
                    <li>Proveer y mejorar nuestros servicios, productos y sitio web.</li>
                    <li>Personalizar tu experiencia de compra y las ofertas que te mostramos.</li>
                    <li>Comunicarnos contigo sobre tu cuenta, pedidos o para fines de marketing (con tu consentimiento).</li>
                    <li>Mantener la seguridad de nuestros servicios y prevenir fraudes.</li>
                    <li>Cumplir con obligaciones legales y regulatorias.</li>
                </ul>

                <h3>3. Compartir tu Información</h3>
                <p>No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información en las siguientes circunstancias:</p>
                <ul>
                    <li><strong>Proveedores de Servicios:</strong> Con terceros que nos ayudan a operar nuestro negocio (ej. pasarelas de pago, servicios de envío, análisis de datos).</li>
                    <li><strong>Cumplimiento Legal:</strong> Cuando la ley lo exija o en respuesta a procesos legales válidos.</li>
                    <li><strong>Transferencias de Negocio:</strong> En relación con la venta, fusión o transferencia de la totalidad o una parte de nuestro negocio.</li>
                </ul>

                <h3>4. Seguridad de los Datos</h3>
                <p>Implementamos medidas de seguridad razonables para proteger tu información personal contra el acceso no autorizado, la divulgación, la alteración o la destrucción. Sin embargo, ninguna transmisión de datos por Internet es 100% segura.</p>

                <h3>5. Tus Derechos</h3>
                <p>Puedes tener ciertos derechos con respecto a tu información personal, según las leyes aplicables, incluyendo el derecho a acceder, corregir o eliminar tu información.</p>

                <h3>6. Cambios en esta Política de Privacidad</h3>
                <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cualquier cambio publicando la nueva política en esta página y actualizando la "Fecha de última actualización".</p>

                <h3>7. Contacto</h3>
                <p>Si tienes preguntas sobre esta Política de Privacidad, por favor contáctanos a través de [tu correo electrónico de contacto o formulario de contacto].</p>
            </div>
            <Link to="/" className="static-content-back-button">Volver a Inicio</Link>
        </div>
    );
}

export default PrivacyPolicyPage;