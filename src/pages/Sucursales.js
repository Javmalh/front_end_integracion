// src/pages/Sucursales.js
import React from 'react';
import './Sucursales.css'; // Asegúrate de que tienes este CSS para tus estilos de sucursales
import sucursalesData from '../data/sucursalesData'; // Importa los datos de las sucursales

function Sucursales() {
    return (
        <div className="Sucursal">
            <main>
                <div className="sucursal-page">
                    <section className="featured-sucursal">
                        <h3>Sucursales</h3>
                        <div className="sucursal-grid">
                            {/* Mapea sobre los datos importados para renderizar las tarjetas */}
                            {sucursalesData.map(sucursal => (
                                <div key={sucursal.id} className="sucursal-card">
                                    <h2>{sucursal.title}</h2>
                                    <p>{sucursal.address}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Sucursales;