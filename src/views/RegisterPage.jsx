import React, { useState } from "react";
import "../styles/RegisterStyle.css";
import gestionService from "../services/gestion-service";
import { Link, useNavigate } from "react-router-dom";
import { differenceInYears } from "date-fns";
import volverIcon from "../assets/Icons/x-thin.svg";

/**
 * Vista de la página de registro de usuarios.
 * Permite crear una nueva cuenta proporcionando datos como nombre, correo, contraseña, y fecha de nacimiento.
 * Valida dominios de correo permitidos y verifica si el usuario ya está registrado.
 *
 * @returns {JSX.Element} Formulario de registro de usuarios.
 */
export default function RegisterPage() {
  /**
   * Estados para almacenar los datos del formulario.
   */
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [planUsuario, setPlanUsuario] = useState("Basico");
  const [idRol, setIdRol] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Obtiene la fecha actual en formato `YYYY-MM-DD` para limitar la selección en el campo de fecha.
  const currentDate = new Date().toISOString().split('T')[0];

  // Lista de dominios permitidos para el registro de correos.
  const allowedDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "live.com",
    "12deseos.com",
    "example.com"
  ];

  /**
   * Verifica si el correo proporcionado tiene un dominio permitido.
   *
   * @param {string} email - Correo electrónico ingresado.
   * @returns {boolean} `true` si el dominio está permitido, de lo contrario, `false`.
   */
  const isAllowedEmail = (email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  /**
   * Maneja el envío del formulario y registra al usuario si los datos son válidos.
   *
   * @param {Event} event - Evento de envío del formulario.
   */
  async function handleCreateUser(event) {
    event.preventDefault();
    if (!isAllowedEmail(correo)) {
      setErrorMessage("Por favor, utiliza un correo electrónico de un dominio permitido.");
      setSuccessMessage("");
      return;
    }

    try {
      const userExists = await gestionService.getUserByEmail(correo);
      if (userExists) {
        setErrorMessage("El correo electrónico ya está registrado");
        setSuccessMessage("");
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const response = await gestionService.register({
            nombre,
            correo,
            password,
            edad,
            planUsuario,
            idRol,
          });

          // Limpia los campos del formulario después de un registro exitoso.
          setNombre("");
          setCorreo("");
          setPassword("");
          setEdad("");
          setPlanUsuario("Basico");
          setIdRol("");
          setSuccessMessage("Usuario registrado correctamente");
          setErrorMessage("");
        } catch (registerError) {
          setErrorMessage("No fue posible crear el usuario");
          setSuccessMessage("");
        }
      } else {
        setErrorMessage("Hubo un error al verificar el correo");
      }
    }
  }

  /**
   * Calcula la edad del usuario al cambiar la fecha de nacimiento.
   *
   * @param {Event} e - Evento de cambio en el campo de fecha.
   */
  const handleDateChange = (e) => {
    const date = e.target.value;
    setFechaNacimiento(date);
    const calculatedAge = differenceInYears(new Date(), new Date(date));
    setEdad(calculatedAge);
  };

  /**
   * Estructura principal de la página de registro de usuarios.
   */
  return (
    <div className="register-page">
      <div className="register-container">
        <Link to="/"><img src={volverIcon} alt="volver-icon" className="volver-icon" /></Link>
        <h2>Regístrate</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input onChange={(e) => setNombre(e.target.value)} type="text" id="nombre" name="nombre" value={nombre} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setCorreo(e.target.value)} type="email" id="email" name="email" value={correo} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" value={password} required maxLength="16" />
            <small className="password-limit-note">
              La contraseña puede tener un máximo de 16 caracteres.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={fechaNacimiento} onChange={handleDateChange} required readOnly={false} max={currentDate}/>
          </div>
          <div className="form-group">
            <a href="/login">¿Ya eres miembro?</a>
          </div>
          <button type="submit" className="register-button">Regístrate</button>
        </form>
      </div>
    </div>
  );
}
