import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HistorialCompra.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar/Navbar";
import '../components/Navbar/Navbar.css';

const HistorialCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para saber si el usuario está autenticado

  const cuponesMap = {
    1: "Tu comida favorita",
    2: "Escapada a la playa",
    3: "Noche de películas",
    4: "Noche de fiesta",
    5: "Paseo en bicicleta",
    6: "Elegir el almuerzo",
    7: "Elegir el almuerzo",
    8: "Elegir el almuerzo",
    9: "Día de Trekking",
    10: "Desayuno en la cama",
    11: "Salida con el papá",
    12: "Salida con la mamá",
    13: "Noche de películas",
    14: "Hacer un experimento",
    15: "Un cuento antes de...",
    16: "Día de spa",
    17: "Un café conversado",
    18: "Salida de shopping",
    19: "Chofer por un día",
    20: "Pijamada",
    21: "Lavado de auto",
    22: "Dormir hasta tarde",
    23: "Tarde de diversión",
    24: "12 abrazos de oso",
    25: "Masaje en la espalda",
    26: "Dormir sin que me despierten",
    27: "Regaloneo especial",
    28: "Desayuno a la cama",
    29: "Yo me hago cargo!",
    30: "Antojo",
    31: "Personalizable 1",
    32: "Personalizable 2",
    33: "Personalizable 3",
    34: "Personalizable 4",
    35: "Personalizable 5",
  };

  useEffect(() => {
    const token = localStorage.getItem("userJwt"); // Obtén el token desde localStorage
    if (token) {
      setIsAuthenticated(true);
      const emailFromToken = jwtDecode(token).correo; // Decodifica el token para obtener el correo
      getUserIdByEmail(emailFromToken); // Llama a la función para obtener el ID del usuario usando el correo
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Función para obtener el userId a partir del correo
  const getUserIdByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/usuarios/correoId/${email}`);
      if (response && response.data) {
        setUserId(response.data); // Establece el userId
      }
    } catch (error) {
      console.error("Error al obtener el userId:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchCompras = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/compras/idUsuario/${userId}`);
          setCompras(response.data);
        } catch (error) {
          console.error("Error al obtener el historial de compras:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCompras();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Cargando historial de compras...</div>;
  }

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mes es 0-11, sumamos 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para formatear el precio en CLP
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

  return (
    <div style={{display:"flex", flexDirection:"column"}}>
    <div style={{display:"block"}}><Navbar/> </div>
    <div className="historial-container" style={{display:"flex", flexDirection:"column"}}>
    <div style={{position:"relative", top:"10%"}}><h2>Historial de Compras</h2></div>
      <div className="historial-compras">
    
        {compras.length === 0 ? (
          <p>No has realizado compras aún.</p>
        ) : (
         <div style={{overflowY:"auto", maxHeight:"100%"}}>
           <table className="tabla-compras">
            <thead style={{position:"sticky"}}>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
                <th>Cupones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{formatFecha(compra.fechaCompra)}</td>
                  <td>{formatPrecio(compra.montoTotal)}</td>
                  <td>
                    {compra.cuponesFinales.length === 0 ? (
                      <span>No hay cupones</span>
                    ) : (
                      compra.cuponesFinales
                        .map((cupon) =>
                          cuponesMap[cupon.idCupon] || "Extra" // Si no está en el mapa, asigno "Extra"
                        )
                        .join(", ")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
        )}
      </div>
    </div>
</div> 
  );
};

export default HistorialCompras;
