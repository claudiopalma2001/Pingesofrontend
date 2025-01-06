import React from "react";
import "../styles/CartNotification.css";
import {Link} from "react-router-dom";

function CartNotification({ show, itemName, itemImage, onClose }) {


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
