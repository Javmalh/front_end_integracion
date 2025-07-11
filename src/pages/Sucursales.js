
import React from 'react';
import './Sucursales.css';
import sucursalesData from '../data/sucursalesData';

function Sucursales() {
    return (
        <div className="Sucursal">
            <main>
                <div className="sucursal-page">
                    <section className="featured-sucursal">
                        <h3>Sucursales</h3>
                        <div className="sucursal-grid">
                            {}
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