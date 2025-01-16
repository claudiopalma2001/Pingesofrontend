import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/Logo/DoceDeseosLogo.jpg";
import flores from "../../assets/Logo/flores.12deseos.png";
import userIcon from "../../assets/Icons/user-circle-svgrepo-com.svg";
import searchIcon from "../../assets/Icons/search-svgrepo-com.svg";
import cartIcon from "../../assets/Icons/cart.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import gestionService from "../../services/gestion-service";

/**
 * Componente Navbar.
 * Muestra la barra de navegación principal con opciones para autenticación, navegación, y acciones específicas para usuarios autenticados.
 *
 * @param {function} toggleSidebar - Función para abrir o cerrar la barra lateral de cupones.
 * @returns {JSX.Element} Barra de navegación.
 */
const Navbar = ({ toggleSidebar}) => {
  const navigate = useNavigate(); // Hook para manejar la navegación.
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado.
  const [name, setName] = useState(""); // Almacena el nombre del usuario.
  const [userId, setId] = useState(null); // ID del usuario autenticado.
  const [correo, setCorreo] = useState(""); // Correo electrónico del usuario.
  const [userRole, setUserRole] = useState(null); // Rol del usuario autenticado.
  const token = localStorage.getItem("userJwt"); // Recupera el token JWT del almacenamiento local.

  const location = useLocation(); // Hook para obtener la ruta actual.

  /**
   * Verifica la autenticación y extrae la información del usuario desde el token.
   */
  useEffect(() => {
    const token = localStorage.getItem("userJwt");
    if (token) {
      setIsAuthenticated(true); // Usuario autenticado si hay token.
      getUserNameFromToken(token); // Extrae el nombre del usuario.
    } else {
      setIsAuthenticated(false); // Usuario no autenticado si no hay token.
    }
  }, [token]); // Actualiza cuando cambie el token.

  /**
   * Cierra la sesión del usuario eliminando el token y redirige al inicio.
   */
  const logout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem("userJwt");

    // Cambia el estado de autenticación para reflejar que el usuario ha cerrado sesión
    setIsAuthenticated(false);

    // Redirige al homepage después de cerrar sesión
    navigate("/");
  };

  /**
   * Extrae el nombre del usuario desde el token y lo obtiene del servicio gestionService.
   *
   * @param {string} token - Token JWT del usuario.
   */
  async function getUserNameFromToken(token) {
    if (token) {
      try {
        const emailFromToken = jwtDecode(token).correo;
        const response = await gestionService.getUserByEmail(emailFromToken);
        if (response && response.data) {

          setName(response.data.nombre);
          setUserRole(response.data.idRol);
          setId(response.data.id);

        }
      } catch (error) {
        console.log("Error decoding JWT token or fetching user data", error);
      }
    }
  }


  /**
   * Extrae el correo del usuario desde el token.
   *
   * @param {string} token - Token JWT del usuario.
   */
  async function getUserEmailFromToken(token) {
    if (token) {
      try {
        const emailFromToken = jwtDecode(token).correo;
        setCorreo(emailFromToken);
      } catch (error) {
        console.log("Error decoding JWT token or fetching user data", error);
      }
    }
  }

  // Llama a la función para obtener el correo del usuario al montar el componente.
  useEffect(() => {
    getUserEmailFromToken(token);
  });

  /**
   * Estructura de la barra de navegación.
   */
  return (
    <div className="navbar">
      <Link to="/"><img src={logo} alt="Logo" className="navbar-logo" /></Link>
      <button onClick={toggleSidebar} className="toggle-sidebar-button">
        ☰ Cupones
      </button>
      <div className="navbar-actions-right">
        {isAuthenticated ? (
          location.pathname !== `/user/${correo}` ? (
              <>
                <Link to={`/user/${correo}`}>
                  <button type="button">
                    ¡Hola! <b style={{textTransform: "uppercase"}}>{name}</b>
                  </button>
                </Link>
                <div className="vertical-line"></div>
                {userRole === 1 && (
                      <Link to={`/admin/${correo}`}>
                        <button type="button">Administrar cupones</button>
                      </Link>
                )}
                {userRole === 1 && (
                    <div className="vertical-line"></div>
                )}
                <button onClick={logout} type="button">
                  Cerrar sesión
                </button>
                <Link to="/cart"><img src={cartIcon} alt="Logo" className="navbar-cart"/></Link>
              </>
          ) : (
              <>
              <Link to="/">
                  <button type="button">Inicio</button>
                </Link>
                <div className="vertical-line"></div>
                <button onClick={logout} type="button">
                  Cerrar sesión
                </button>
                <Link to="/cart"><img src={cartIcon} alt="Logo" className="navbar-cart"/></Link>
              </>
          )
        ) : (
            <>
              <Link to="/login">
                <button type="button">Iniciar sesión</button>
              </Link>
              <div className="vertical-line"></div>
              <Link to="/register">
                <button type="button">Registrarse</button>
              </Link>
              <Link to="/cart"><img src={cartIcon} alt="Logo" className="navbar-cart"/></Link>
            </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
