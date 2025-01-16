import React from "react";
import "../styles/CartNotification.css";
import {Link} from "react-router-dom";

/**
 * Componente para mostrar una notificación emergente cuando un artículo es agregado al carrito.
 * Incluye el nombre, imagen del artículo, y un botón para navegar al carrito.
 *
 * @param {boolean} show - Controla si la notificación se muestra o no.
 * @param {string} itemName - Nombre del artículo agregado al carrito.
 * @param {string} itemImage - Nombre del archivo de la imagen del artículo.
 * @param {function} onClose - Función para cerrar la notificación.
 *
 */
function CartNotification({ show, itemName, itemImage, onClose }) {

    /**
     * Contenedor principal de la notificación.
     * La clase `show` se agrega dinámicamente, si `show` es verdadero muestra la notificación.
     */
    return (
            <div className={`cart-notification ${show ? "show" : ""}`}>
                <p>✅ Agregado a tu carrito</p>
                <hr className="divider-line"/>
                <div className="notification-content">
                    <h4>{itemName}</h4>
                    {itemImage && (
                        <img
                            src={require(`../assets/Plantillas/Todas/${itemImage}`)}
                            alt="Cupón agregado"
                            className="notification-image"
                        />
                    )}
                    <Link to="/cart">
                    <button className="view-cart-button" onClick={onClose}>
                        Ver carrito
                    </button>
                    </Link>
                </div>
            </div>
    );
}

export default CartNotification;
