import React, { useState } from 'react';
import '../styles/LoginStyle.css';
import gestionService from '../services/gestion-service';
import {Link, useNavigate} from 'react-router-dom';
import volverIcon from "../assets/Icons/x-thin.svg";

/**
 * Vista de la página de inicio de sesión.
 * Permite a los usuarios autenticarse mediante su correo electrónico y contraseña.
 * En caso de error, muestra un mensaje debajo del campo de contraseña.
 *
 * @returns {JSX.Element} Componente de inicio de sesión.
 */
export default function FunctionLoginPage() {

    /**
     * Estado para almacenar el correo electrónico ingresado.
     * @type {[string, function]} correo - Correo electrónico ingresado por el usuario.
     */
    const [correo, setCorreo] = useState("");

    /**
     * Estado para almacenar la contraseña ingresada.
     * @type {[string, function]} password - Contraseña ingresada por el usuario.
     */
    const [password, setPassword] = useState("");

    /**
     * Estado para mostrar mensajes de error relacionados con la autenticación.
     * @type {[string, function]} errorMessage - Mensaje de error que se muestra si las credenciales son inválidas.
     */
    const navigate = useNavigate();

    // Hook para redirigir a otras páginas de la aplicación.
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Maneja el evento de envío del formulario para autenticar al usuario.
     * Realiza una llamada al servicio de autenticación y, si es exitoso, guarda el token JWT en el almacenamiento local.
     *
     * @param {Event} event - Evento de envío del formulario.
     */
    async function handleLoginUser(event) {
        event.preventDefault();
        try {
            const response = await gestionService.login({ correo, password });
            if (response.data.success) {
                console.log(response.data);
                localStorage.setItem('userJwt', response.data.jwt);
                navigate("/");
            } else {
                setErrorMessage("* Email y/o Contraseña incorrecta *");
            }
        } catch (error) {
            setErrorMessage("* Email y/o Contraseña incorrecta * ");
        }
    }

    /**
     * Estructura visual principal del formulario de inicio de sesión.
     */
    return (
        <div className="login-page">
            <div className="login-container">
                <Link to="/"><img src={volverIcon} alt="volver-icon" className="volver-icon"/></Link>
                <h2>Iniciar sesión</h2>
                <p>¿Es tu primera vez? <a href="/register">Regístrate</a></p>
                <form onSubmit={handleLoginUser}>
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input onChange={(e) => setCorreo(e.target.value)} type="email" id="email" name="email"
                               required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password"
                               name="password" required/>
                        {errorMessage && (
                            <p className="error-message">{errorMessage}</p> // Muestra el mensaje de error
                        )}
                    </div>
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
};
