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

const Navbar = ({ toggleSidebar}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [userId, setId] = useState(null);
  const [correo, setCorreo] = useState("");
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem("userJwt");

  /*Para saber si estoy en UserProfile */
  const location = useLocation();

  // Verifica la autenticación cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem("userJwt");
    if (token) {
      setIsAuthenticated(true); // Si hay token, el usuario está autenticado
      getUserNameFromToken(token); // Obtén el nombre del usuario desde el token
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  }, [token]); // Depende de `token` para que se actualice cuando cambie.

  const logout = () => {
    // Elimina el token del localStorage
    localStorage.removeItem("userJwt");

    // Actualiza el estado para reflejar que el usuario ha cerrado sesión
    setIsAuthenticated(false);

    // Redirige al homepage (o login) después de cerrar sesión
    navigate("/"); // O usa '/login' si prefieres redirigir al login explícitamente
  };

  // Función para obtener el nombre del usuario desde el token
  async function getUserNameFromToken(token) {
    if (token) {
      try {
        const emailFromToken = jwtDecode(token).correo;
        const response = await gestionService.getUserByEmail(emailFromToken);
        if (response && response.data) {
          // Asegúrate de que `response.data` sea correcto
          setName(response.data.nombre);
          setUserRole(response.data.idRol);
          setId(response.data.id);

        }
      } catch (error) {
        console.log("Error decoding JWT token or fetching user data", error);
      }
    }
  }


  // Función para obtener el correo del usuario desde el token
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

  
  useEffect(() => {
    getUserEmailFromToken(token);
  });

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
                {userRole === 1 && ( // Si el usuario es administrador, mostrar el botón "Administrar cupones"
                      <Link to={`/admin/${correo}`}>
                        <button type="button">Administrar cupones</button>
                      </Link>
                )}
                {userRole === 1 && ( // Si el usuario es administrador, mostrar el botón "Administrar cupones"
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
