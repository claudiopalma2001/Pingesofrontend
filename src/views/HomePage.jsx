
import '../styles/HomeStyle.css';
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import BodyContent from './BodyContent.jsx';
import SideBar, { Sidebar } from '../components/SideBar/SideBar';
import * as React from "react";
import "../components/SideBar2/styles.css";
import bannerImagen from "../assets/Plantillas/Banner/banner-gif2.gif"
import {useState} from "react";


const HomePage = () => {

    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => {
        setSidebarVisible((prevState) => !prevState);
    };
    const closeSidebar = () => {
        setSidebarVisible(false);
    }

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar}/>
            <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
            <div className="main-content">
                <div className="cupons-body">
                    {/* Muestra la imagen de banner */}
                    <img src={bannerImagen} alt="Banner principal" className="banner-image"/>
                    <BodyContent/>
                </div>
            </div>
        </div>

    );
};

export default HomePage;