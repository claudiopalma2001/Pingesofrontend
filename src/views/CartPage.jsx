
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import * as React from "react";
import "../components/SideBar2/styles.css";
import "../styles/CartPage.css";
import CartBodyContent from "./CartBodyContent";
import SideBar from "../components/SideBar/SideBar";
import '../styles/CartPage.css'
import {useState} from "react";

/**
 * Vista principal de la página del carrito de compras.
 * Incluye un encabezado, un componente para el contenido del carrito y una barra lateral (sidebar).
 *
 */
const CartPage = () => {

    /**
     * Estado para controlar la visibilidad de la barra lateral (sidebar).
     * @type {boolean} isSidebarVisible - Determina si la barra lateral está visible.
     */
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    /**
     * Alterna la visibilidad de la barra lateral.
     */
    const toggleSidebar = () => {
        setSidebarVisible((prevState) => !prevState);
    };

    /**
     * Cierra la barra lateral.
     */
    const closeSidebar = () => setSidebarVisible(false);

    /**
     * Estructura principal de la página del carrito.
     * Incluye el navbar, la sidebar y el contenido del carrito de compras.
     */
    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
            <div className="cart-page">
                <div className="cart-content">
                    <div>
                        <h3>Mi carrito</h3>
                    </div>
                    <hr className="divider-line"/>
                    <div style={{height: "10px"}}></div>
                    <div>
                        <CartBodyContent/>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CartPage;