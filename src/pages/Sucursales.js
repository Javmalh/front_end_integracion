import React from 'react';
import './Sucursales.css';

function Sucursales() {
    return (
        <div className="Sucursal">
            <main>
                <div className="sucursal-page">
                    <section className="featured-sucursal">
                        <h3>Sucursales</h3>
                        <div className="sucursal-grid">
                            <div className="sucursal-card">
                                <h2>Sucursal Centro</h2>
                                <p>Ruiz Tagle 190, Estación Central, Región Metropolitana</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Norte</h2>
                                <p>Av. Independencia 2839, Santiago, Independencia, Región Metropolitana</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Sur</h2>
                                <p>Domingo Tocornal 149, Puente Alto, Región Metropolitana</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Este</h2>
                                <p>Av. Ossa 528, Ñuñoa, Región Metropolitana</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Oeste</h2>
                                <p>San Pablo 8867, Pudahuel, Región Metropolitana</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Valparaiso</h2>
                                <p>Chacabuco 2590, Valparaíso, Valparaíso</p>
                            </div>
                            <div className="sucursal-card">
                                <h2>Sucursal Concepcion</h2>
                                <p>Freire 1345, Concepción, Bío Bío</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Sucursales;
