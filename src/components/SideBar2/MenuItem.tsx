import * as React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';


const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
}


{/*< SIDEBAR ESTATICA DE MOMENTO, SE IMPLEMENTARA SIDEBAR DINAMICA CON LAS TEMATICAS>*/}
const colors = ["#959595", "#959595", "#959595", "#959595", "#959595", "#959595", "#959595", "#959595"];
const tematicas = ["Pololos", "Familiar", "Infantil", "Amistad", "Papá", "Embarazada", "Personalizable", "Extra"];
const referencias = [
    "/cupones/tematica/1",
    "/cupones/tematica/2",
    "/cupones/tematica/3",
    "/cupones/tematica/4",
    "/cupones/tematica/5",
    "/cupones/tematica/6",
    "/cupones/tematica/7",
    "/cupones/tematica/8"
];


export const MenuItem = ({ i }) => {
    const style = { border: `3px solid ${colors[i]}`, backgroundColor: "#959595"};
    return (
        <motion.li

            variants={variants}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
        >

            <Link className="text-placeholder" to={referencias[i]}>
                {tematicas[i]}
            </Link>


        </motion.li>
    );
};
