import React, { useState } from "react";
import "../styles/RegisterStyle.css";
import gestionService from "../services/gestion-service";
import { Link, useNavigate } from "react-router-dom";
import { differenceInYears } from "date-fns";
import volverIcon from "../assets/Icons/x-thin.svg";

export default function RegisterPage() {
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

  const currentDate = new Date().toISOString().split('T')[0];

  // Lista de dominios permitidos
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

  // Función para verificar si el correo tiene un dominio permitido
  const isAllowedEmail = (email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

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

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFechaNacimiento(date);
    const calculatedAge = differenceInYears(new Date(), new Date(date));
    setEdad(calculatedAge);
  };

  return (
    <div className="login-page">
      <div className="login-container">
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
          <button type="submit" className="login-button">Regístrate</button>
        </form>
      </div>
    </div>
  );
}
