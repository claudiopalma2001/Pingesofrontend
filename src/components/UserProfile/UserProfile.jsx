import { useParams,useNavigate } from "react-router-dom";
import gestionService from "../../services/gestion-service";
import "../UserProfile/UserProfile.css";
import React, { useEffect, useState } from "react";
import profileTest from "../../assets/Icons/profile.jpg";
import Navbar from "../Navbar/Navbar"; 
import Avatar from "react-avatar"
import SideBar from "../SideBar/SideBar";

/**
 * Vista de la pagina del perfil de usuario.
 * Incluye la información personal del usuario, opciones para ver el historial de cupones, y un botón para cerrar sesión.
 *
 * @returns {JSX.Element} Perfil de usuario.
 */
function UserProfile() {
  /**
   * Obtiene el correo del usuario desde los parámetros de la URL.
   */
  const { correo } = useParams();

  /**
   * Estado que almacena la información del usuario.
   * @type {[Object, function]} user - Objeto con los datos del usuario.
   */
  const [user, setUser] = useState({});

  // Hook para redirigir a otras rutas.
  const navigate = useNavigate();

  /**
   * Obtiene los datos llamando a la API para obtener la información del usuario
   */
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await gestionService.getUserByEmail(correo);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchUserData();
  }, [correo]); // Llamada inicial para obtener los datos.

  /**
   * Maneja el cierre de sesión del usuario.
   * Elimina el token JWT del almacenamiento local y redirige al inicio.
   */
  const logout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem('userJwt');

    // Redirige al homepage después de cerrar sesión
    navigate('/');
}

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
   * Estructura del perfil del usuario.
   * Incluye un avatar, información personal, y opciones para navegar.
   */
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
