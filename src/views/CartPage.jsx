
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import * as React from "react";
import "../components/SideBar2/styles.css";
import "../styles/CartPage.css";
import CartBodyContent from "./CartBodyContent";
import SideBar from "../components/SideBar/SideBar";
import '../styles/CartPage.css'
import {useState} from "react";


const CartPage = () => {

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible((prevState) => !prevState);
    };
    const closeSidebar = () => setSidebarVisible(false);

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