import React from 'react';
import { Link } from 'react-router-dom';
import './StaticContentPage.css';

function TermsAndConditionsPage() {
    return (
        <div className="static-content-page-container">
            <h1 className="static-content-title">Términos y Condiciones de Uso de FerreMax</h1>
            <div className="static-content-text">
                <p><strong>Fecha de última actualización:</strong> 10 de julio de 2025</p>

                <p>Bienvenido a FerreMax. Al acceder y utilizar nuestro sitio web y servicios, aceptas estar sujeto a los siguientes términos y condiciones de uso ("Términos y Condiciones"). Por favor, léelos detenidamente.</p>

                <h3>1. Aceptación de los Términos</h3>
                <p>Estos Términos y Condiciones constituyen un acuerdo legal vinculante entre tú y FerreMax. Al acceder o utilizar cualquier parte de nuestro sitio o servicios, aceptas estos Términos. Si no estás de acuerdo con todos los términos y condiciones de este acuerdo, no podrás acceder al sitio web ni utilizar ningún servicio.</p>

                <h3>2. Uso del Sitio Web</h3>
                <ul>
                    <li>El uso de nuestro sitio web es para tu uso personal y no comercial.</li>
                    <li>Te comprometes a no utilizar el sitio para fines ilegales o no autorizados.</li>
                    <li>Debes tener al menos la mayoría de edad en tu jurisdicción para realizar compras en el sitio.</li>
                </ul>

                <h3>3. Cuentas de Usuario</h3>
                <ul>
                    <li>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</li>
                    <li>Eres responsable de todas las actividades que ocurran bajo tu cuenta.</li>
                    <li>Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.</li>
                </ul>

                <h3>4. Productos y Precios</h3>
                <ul>
                    <li>Nos esforzamos por mostrar la información de los productos y precios de la manera más precisa posible. Sin embargo, no garantizamos que la descripción de los productos, precios u otro contenido del sitio sea completa, precisa, actual o libre de errores.</li>
                    <li>Nos reservamos el derecho de modificar o descontinuar cualquier producto o servicio sin previo aviso.</li>
                </ul>

                <h3>5. Órdenes y Pagos</h3>
                <ul>
                    <li>Todas las órdenes realizadas a través del sitio están sujetas a disponibilidad y a nuestra confirmación.</li>
                    <li>Los pagos se procesan a través de pasarelas de pago de terceros (ej. Transbank). No almacenamos directamente tu información financiera sensible.</li>
                    <li>Al confirmar tu compra, te comprometes a pagar el monto total indicado.</li>
                </ul>

                <h3>6. Propiedad Intelectual</h3>
                <p>Todo el contenido del sitio web (textos, gráficos, logotipos, imágenes, etc.) es propiedad de FerreMax o de sus licenciantes y está protegido por leyes de propiedad intelectual.</p>

                <h3>7. Enlaces a Terceros</h3>
                <p>Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables del contenido o las prácticas de privacidad de dichos sitios.</p>

                <h3>8. Limitación de Responsabilidad</h3>
                <p>FerreMax no será responsable de ningún daño directo, indirecto, incidental, consecuencial o especial que resulte del uso o la imposibilidad de usar el sitio o los productos.</p>

                <h3>9. Indemnización</h3>
                <p>Te comprometes a indemnizar y eximir de responsabilidad a FerreMax de cualquier reclamo o demanda, incluidos los honorarios de abogados, realizados por un tercero debido a tu incumplimiento de estos Términos.</p>

                <h3>10. Modificaciones de los Términos</h3>
                <p>Nos reservamos el derecho de actualizar, cambiar o reemplazar cualquier parte de estos Términos y Condiciones publicando actualizaciones en nuestro sitio web. Es tu responsabilidad revisar periódicamente esta página para ver los cambios.</p>

                <h3>11. Ley Aplicable</h3>
                <p>Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de la República de Chile.</p>

                <h3>12. Contacto</h3>
                <p>Si tienes preguntas sobre estos Términos y Condiciones, por favor contáctanos a través de [tu correo electrónico de contacto o formulario de contacto].</p>
            </div>
            <Link to="/" className="static-content-back-button">Volver a Inicio</Link>
        </div>
    );
}

export default TermsAndConditionsPage;