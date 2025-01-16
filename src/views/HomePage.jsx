
import '../styles/HomeStyle.css';
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import BodyContent from './BodyContent.jsx';
import SideBar, { Sidebar } from '../components/SideBar/SideBar';
import * as React from "react";
import "../components/SideBar2/styles.css";
import bannerImagen from "../assets/Plantillas/Banner/banner-gif2.gif"
import {useState} from "react";

/**
 * Página principal de la aplicación.
 * Muestra un banner, contenido destacado, y permite la navegación mediante un menú lateral (sidebar).
 *
 * @returns {JSX.Element} Página principal de la aplicación.
 */
const HomePage = () => {

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
    const closeSidebar = () => {
        setSidebarVisible(false);
    }

    /**
     * Estructura principal de la página principal.
     * Incluye el navbar, la sidebar y el contenido principal del banner y contenido destacado.
     */
    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
            <div className="main-content">
                <div className="cupons-body">
                    <img src={bannerImagen} alt="Banner principal" className="banner-image"/>
                    <BodyContent/>
                </div>
            </div>
        </div>
    );
};

export default HomePage;