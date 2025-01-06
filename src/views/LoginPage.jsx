import React, { useState } from 'react';
import '../styles/LoginStyle.css';
import gestionService from '../services/gestion-service';
import {Link, useNavigate} from 'react-router-dom';
import volverIcon from "../assets/Icons/x-thin.svg";

export default function FunctionLoginPage() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLoginUser(event) {
        event.preventDefault();
        try {
            const response = await gestionService.login({ correo, password });
            if (response.data.success) {
                console.log(response.data);
                localStorage.setItem('userJwt', response.data.jwt);
                navigate("/");
            } else {
                setErrorMessage("* Email y/o Contraseña incorrecta *"); // Establece el mensaje de error
            }
        } catch (error) {
            setErrorMessage("* Email y/o Contraseña incorrecta * "); // Maneja errores del servidor
        }
    }

   

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
