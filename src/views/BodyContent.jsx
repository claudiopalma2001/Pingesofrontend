
import img1 from '../assets/Plantillas/Tapas/pololostapa.png';
import img2 from '../assets/Plantillas/Tapas/familiartapa.png';
import img3 from '../assets/Plantillas/Tapas/infantiltapa.png';
import img4 from '../assets/Plantillas/Tapas/amistadtapa.png';
import img5 from '../assets/Plantillas/Tapas/papatapa.png';
import img6 from '../assets/Plantillas/Tapas/embarazadatapa.png';
import img7 from '../assets/Plantillas/Tapas/personalizabletapa.png';

import '../components/SideBar2/styles.css';
import '../styles/BodyContent.css'
import React, {useState} from "react";
function BodyContent() {
    const coupons = [
        { id: 1, title: 'Pololos', image: img1 },
        { id: 2, title: 'Familiar', image: img2 },
        { id: 3, title: 'Infantil', image: img3 },
        { id: 4, title: 'Amistad', image: img4 },
        { id: 5, title: 'Papá', image: img5 },
        { id: 6, title: 'Embarazada', image: img6 },
        { id: 7, title: 'Personalizable', image: img7 },
    ];

    const [loaded, setLoaded] = useState(false);

    return (

        <div className="cupons-body-content2">
            {coupons.map((coupon) => (
                <div key={coupon.id} className="cupon-card2">
                    <img
                        src={coupon.image} alt={coupon.title}
                        className={`plantilla-image2 ${loaded ? "loaded" : ""}`}
                        onLoad={() => setLoaded(true)}
                    />
                    <h3>{coupon.title}</h3>
                </div>
            ))}
            <div style={{height: "80px"}}></div>

        </div>

    );
}

export default BodyContent;