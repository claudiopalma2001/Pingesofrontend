
import '../styles/HomeStyle.css';
import '../components/Navbar/Navbar.css';
import Navbar from '../components/Navbar/Navbar.jsx';
import CuponBodyContent from "./CuponesBodyContent";
import '../styles/CuponesBodyContent.css'
import { Example } from '../components/SideBar2/Example';
import * as React from "react";
import "../components/SideBar2/styles.css";
import {useParams} from "react-router-dom";
import {useState} from "react";
import SideBar from "../components/SideBar/SideBar";


const CuponesPage = () => {

    const { idTematica } = useParams();

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible((prevState) => !prevState);
    };
    const closeSidebar = () => setSidebarVisible(false);



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