import { useNavigate } from "react-router-dom";
import img1 from '../assets/Plantillas/Tapas/pololostapa.png';
import img2 from '../assets/Plantillas/Tapas/familiartapa.png';
import img3 from '../assets/Plantillas/Tapas/infantiltapa.png';
import img4 from '../assets/Plantillas/Tapas/amistadtapa.png';
import img5 from '../assets/Plantillas/Tapas/papatapa.png';
import img6 from '../assets/Plantillas/Tapas/embarazadatapa.png';
import img7 from '../assets/Plantillas/Tapas/personalizabletapa.png';
import '../components/SideBar2/styles.css';
import '../styles/BodyContent.css';
import React, { useState } from "react";

/**
 * Componente que muestra una lista de tarjetas de cupones temáticos.
 * Cada tarjeta contiene una imagen y un título, y es clicable para navegar
 * a una ruta específica según la temática del cupón.
 *
 */
function BodyContent() {
    // Hook para manejar la navegación entre rutas en la aplicación.
    const navigate = useNavigate();

    /**
     * Lista de cupones disponibles.
     * Cada elemento contiene:
     * - `id`: Identificador único del cupón.
     * - `title`: Título del cupón.
     * - `image`: Ruta de la imagen asociada al cupón.
     * - `path`: Ruta a la que redirige al hacer clic en el cupón.
     */
    const coupons = [
        { id: 1, title: 'Pololos', image: img1, path: "/cupones/tematica/1" },
        { id: 2, title: 'Familiar', image: img2, path: "/cupones/tematica/2" },
        { id: 3, title: 'Infantil', image: img3, path: "/cupones/tematica/3" },
        { id: 4, title: 'Amistad', image: img4, path: "/cupones/tematica/4" },
        { id: 5, title: 'Papá', image: img5, path: "/cupones/tematica/5" },
        { id: 6, title: 'Embarazada', image: img6, path: "/cupones/tematica/6" },
        { id: 7, title: 'Personalizable', image: img7, path: "/cupones/tematica/7" },
    ];

    // Estado que controla si las imágenes ya se han cargado.
    const [loaded, setLoaded] = useState(false);

    /**
     * Navega a la ruta específica del cupón al hacer clic en la tarjeta.
     *
     * @param {string} path - Ruta a la que se debe redirigir.
     */
    const handleNavigate = (path) => {
        navigate(path);
    };

    /**
     * Estructura visual de la lista de tarjetas de cupones temáticos.
     */
    return (
        <div className="cupons-body-content2">
            {coupons.map((coupon) => (
                <div
                    key={coupon.id}
                    className="cupon-card2"
                    onClick={() => handleNavigate(coupon.path)}
                    style={{ cursor: "pointer" }} // Indica visualmente que es clicable
                >
                    <img
                        src={coupon.image}
                        alt={coupon.title}
                        className={`plantilla-image2 ${loaded ? "loaded" : ""}`}
                        onLoad={() => setLoaded(true)}
                    />
                    <h3>{coupon.title}</h3>
                </div>
            ))}
            <div style={{ height: "80px" }}></div>
        </div>
    );
}

export default BodyContent;
