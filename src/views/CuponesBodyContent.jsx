import '../components/SideBar2/styles.css';
import React, { useEffect, useState } from "react";
import gestionService from "../services/gestion-service";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "@fontsource/inria-sans"; //fuente para los titulos

function CuponBodyContent({ idTematica }) {
    const [cupones, setCupones] = useState([]);
    const [plantillas, setPlantillas] = useState({});

    const tematicasNombres = {
        1: "Pololos",
        2: "Familiar",
        3: "Infantil",
        4: "Amistad",
        5: "Papá",
        6: "Embarazada",
        7: "Personalizable",
        8: "Extra"
    };

    const tematicasSlogans = {
        1: "Comparte experiencias con esa persona especial.\n Regala momentos imposibles de envolver!",
        2: "Es una excelente forma de pasar un tiempo en familia. \n Invítalos a compartir un momento único y significativo.",
        3: "Son una creativa forma de pasar un tiempo con los niños.\n Invítalos a compartir un momento único y significativo.",
        4: "Comparte con tus amigas de una forma diferente.\n Regala tu tiempo, regala un momento único!",
        5: "Regala a tu papá una experiencia única!",
        6: "Regala algo para atesorar, una experiencia imposible de envolver!",
        7: "Haz volar tu imaginación!\n Crea una experiencia especial y única.\n Momentos únicos para atesorar.",
        8: "Cupones de temporada!\n Regala en estos momentos únicos del año!."
    };

    const nombreTematica = tematicasNombres[idTematica];
    const sloganTematica = tematicasSlogans[idTematica];

    // Función para transformar \n en <br />
    const formattedSlogan = sloganTematica.split("\n").map((line, index) => (
        <span key={index}>{line}<br /></span>
    ));

    useEffect(() => {
        // Llama al servicio para obtener los cupones
        gestionService.getCuponesByIdTematica(idTematica)
            .then(response => {
                setCupones(response.data); // Guarda los cupones en el estado
                response.data.forEach(cupon => {
                    gestionService.getPlantillasByIdCupon(cupon.id)
                        .then(res => {
                            setPlantillas(prevState => ({
                                ...prevState,
                                [cupon.id]: res.data // Save templates for each coupon ID
                            }));
                        })
                        .catch(error => {
                            console.error(`Error fetching templates for coupon ${cupon.id}:`, error);
                        });
                });
            })
            .catch(error => {
                console.error("Error fetching cupones:", error);
            });
    }, [idTematica]);

    return (
        <div>
            <h1 className="tematica-title" style={{ fontFamily: 'Inria Sans', color: "#8f97a0;" }}> Cupones  <strong style={{ fontWeight: 'bold' }}>{nombreTematica}</strong></h1>
            <h2 className="tematica-slogan" style={{fontFamily: 'Inria Sans'}}>
                {formattedSlogan}
            </h2>
            <h3 className='slogan-text' style={{fontFamily: 'Inria Sans', color:"#72aaac", marginTop:"50px", margin:"15px 0"}}>
                Elige el cupón más entretenido, escribe y personalízalo con los stickers que más te gusten!
            </h3>
            <div className="cupons-body-content">
                {cupones.map((cupon) => (
                    <div key={cupon.id} className="cupon-card">
                        {plantillas[cupon.id] && plantillas[cupon.id].map((plantilla) => (
                            <div key={plantilla.id}>
                                <img
                                    src={require(`../assets/Plantillas/Todas/${plantilla.urlImagen}`)}
                                    alt={`Plantilla ${plantilla.urlImagen}`}
                                    className={`plantilla-image`}
                                />
                            </div>
                        ))}
                        <h3 className="cupons-body-content-info-text">{cupon.nombreCupon}</h3>
                        <div>
                            <label className="cupons-price">${Number(cupon.precio).toLocaleString('es-CL')}</label>
                        </div>
                        <Link to={`/edit/${nombreTematica}/${cupon.id}`}>
                            <button type="submit" className="editar2-button">Editar</button>
                        </Link>
                    </div>
                ))}
                <div style={{ height: "80px" }}></div>
                <div style={{ height: "80px" }}></div>
                <div style={{ height: "80px" }}></div>
            </div>
        </div>
    );
}

export default CuponBodyContent;
