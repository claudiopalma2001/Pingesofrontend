
import '../styles/HomeStyle.css';
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import CuponBodyContent from "./CuponesBodyContent";
import '../styles/CuponesBodyContent.css'
import * as React from "react";
import "../components/SideBar2/styles.css";
import {useParams} from "react-router-dom";
import {useState} from "react";
import SideBar from "../components/SideBar/SideBar";

/**
 * Vista principal para mostrar los cupones de una temática específica.
 *
 * @returns {JSX.Element} Página de cupones.
 */
const CuponesPage = () => {

    /**
     * Obtiene el parámetro `idTematica` de la URL utilizando React Router.
     */
    const { idTematica } = useParams();

    /**
     * Estado para controlar la visibilidad de la sidebar.
     * @type {[boolean, function]} isSidebarVisible - Determina si la sidebar está visible.
     * @type {function} setSidebarVisible - Actualiza el estado de visibilidad de la sidebar.
     */
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    /**
     * Alterna la visibilidad de la sidebar.
     * Si está visible, la oculta; si no, la muestra.
     */
    const toggleSidebar = () => {
        setSidebarVisible((prevState) => !prevState);
    };

    /**
     * Cierra la sidebar estableciendo su visibilidad como `false`.
     */
    const closeSidebar = () => setSidebarVisible(false);

    /**
     * Estructura principal de la página de cupones.
     * Incluye el navbar, la sidebar y el contenido de los cupones.
     */
    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
            <div>
                <div className="cupons-body">
                    <CuponBodyContent idTematica={idTematica}/>
                </div>
            </div>
        </div>
    );
};

export default CuponesPage;