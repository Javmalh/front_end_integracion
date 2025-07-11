import React, { useState, useEffect } from 'react';
import './ProductSlider.css';
import sliderImage1 from '../../assets/slider-img-1.jpg';
import sliderImage2 from '../../assets/slider-img-2.jpg';
import sliderImage3 from '../../assets/slider-img-3.jpg';

const images = [
    { id: 1, src: sliderImage1, alt: 'Oferta Taladros', title: 'Grandes Ofertas en Taladros' },
    { id: 2, src: sliderImage2, alt: 'Nuevas Herramientas', title: 'Descubre Nuestras Últimas Herramientas' },
    { id: 3, src: sliderImage3, alt: 'Materiales Construcción', title: 'Materiales de Construcción de Calidad' },
];

function ProductSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="product-slider">
            {images.map((image, index) => (
                <div
                    key={image.id}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${image.src})` }}
                >
                    <div className="slide-content">
                        <h2>{image.title}</h2>
                        {}
                        {}
                    </div>
                </div>
            ))}
            <div className="dots-container">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default ProductSlider;