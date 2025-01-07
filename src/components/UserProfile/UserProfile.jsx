import { useParams,useNavigate } from "react-router-dom";
import gestionService from "../../services/gestion-service";
import "../UserProfile/UserProfile.css";
import React, { useEffect, useState } from "react";
import profileTest from "../../assets/Icons/profile.jpg";
import Navbar from "../Navbar/Navbar"; 
import Avatar from "react-avatar"
import SideBar from "../SideBar/SideBar";


function UserProfile() {
  const { correo } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Llama a la API para obtener la información del usuario
    async function fetchUserData() {
      try {
        const response = await gestionService.getUserByEmail(correo);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchUserData();
  }, [correo]); // Ejecuta cuando el id cambia

  
  const logout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem('userJwt');
  
    // Redirige al homepage (o login) después de cerrar sesión
    navigate('/'); // O usa '/login' si prefieres redirigir al login explícitamente
}


  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setSidebarVisible(false);
  }

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar}/>
      <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
      <div className="user-profile-body">
        <div className="uqser-account-information">
          <div className="user-profile-photo">
            <Avatar name={user.nombre} size={"80px"} round={true}/>
            <div style={{height: "10px"}}></div>
          </div>
          <div className="user-information-paths">
            
            <div className="user-information-link">
              <button onClick={() => navigate('/historial')} type="button"> Mis cupones </button>
            </div>
            <div className="user-information-link">
              <button onClick={logout} type="button">Cerrar sesión</button>
            </div>
          </div>
        </div>

        <div className="user-account-profile">
          <div className="user-account-profile-name">
            {user ? user.nombre : "Error"}
          </div>
          <div className="user-profile-data">
            <div className="user-profile-field">
              <span className="user-profile-label">Correo : </span>
              <span className="user-profile-value">{user.correo}</span>
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Nombre : </span>
              <span className="user-profile-value">
                {user.nombre || "N/A"}
              </span>
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Edad : </span>
              <span className="user-profile-value">
                {user.edad || "N/A"}
              </span>
            </div>
            <div className="user-profile-field">
              <span className="user-profile-label">Plan Actual : </span>
              <span className="user-profile-value">
                {user.planUsuario || "N/A"}
              </span>
            </div>
            
            
          </div>
          
        </div>
        
      </div>
    </>
  );
}

export default UserProfile;
