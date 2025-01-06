import '../components/SideBar2/styles.css';
import React, { useEffect, useState, useContext} from "react";
import gestionService from "../services/gestion-service";
import {json, Link, useLocation, useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/CartBodyContent.css";
import { jwtDecode } from "jwt-decode";
import trashIcon from "../assets/Icons/trash-icon.svg";
import trashIconDelete from "../assets/Icons/trash-icon-delete.svg";
import volverIcon from "../assets/Icons/x-thin.svg";
import { CartContext } from "../context/CartContext";


/*Los cupones editados entran como props al componente
ver la forma de reeditar el cupon, lo ideal es recargar nuevamente el estado*/
function CartBodyContent() {
    /*Obtengo los cupones temporales(No finales, puesto que aun no se compran)
    a traves de localStorage*/

    const { cartItems, removeFromCart } = useContext(CartContext); // Acceso al estado del carrito
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setId] = useState(null);
    const token = localStorage.getItem("userJwt");
    /*Cupones almacenados en el carrito de compras*/
    const [cupones, SetCupones] = useState([]);
    
    
    /*Los seteo en el estado (ver si es necesario realemnte manejarlo de esta manera)*/
    useEffect(() => {
        const storedCupons = JSON.parse(localStorage.getItem("cartItems")) || [];
        SetCupones(storedCupons);
        console.log(storedCupons); //Esta linea es para ver si se estan pasando los datos de los cupones a traves de local storage
    
    }, []);
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

    // Función para obtener el nombre del usuario desde el token
    async function getUserNameFromToken(token) {
        if (token) {
            try {
                const emailFromToken = jwtDecode(token).correo;
                const response = await gestionService.getUserByEmail(emailFromToken);
                if (response && response.data) {
                    // Asegúrate de que `response.data` sea correcto
                    setId(response.data.id);
                }
            } catch (error) {
                console.log("Error decoding JWT token or fetching user data", error);
            }
        }
    }

    const [cuponesFinales, setCuponesFinales] = useState([]);
    const [plantillasFinales, setPlantillasFinales] = useState({});


    useEffect(() => {
        if (userId) {
            gestionService.getCuponesFinalesByUserId(userId)
                .then(response => {
                    setCuponesFinales(response.data);
                    response.data.forEach(cupon => {
                        if (cupon.idCupon) {
                            gestionService.getPlantillasByIdCupon(cupon.idCupon)
                                .then(res => {
                                    setPlantillasFinales(prevState => ({
                                        ...prevState,
                                        [cupon.id]: res.data
                                    }));
                                })
                                .catch(error => {
                                    console.error(`Error obteniendo plantillas para el cupón ${cupon.idCupon}:`, error);
                                });
                        }
                    });
                })
                .catch(error => {
                    console.error("Error obteniendo los cupones finales:", error);
                });
        }
    }, [userId]);

    const [cuponesNames, setCuponesNames] = useState({});

    useEffect(() => {
        if (cuponesFinales.length > 0) {
            cuponesFinales.forEach((cupon) => {
                if (cupon.idCupon && !cuponesNames[cupon.idCupon]) { // Verifica si el nombre ya está cargado
                    gestionService.getCuponesById(cupon.idCupon)
                        .then((response) => {
                            setCuponesNames((prevState) => ({
                                ...prevState,
                                [cupon.idCupon]: response.data.nombreCupon, // Agrega el nombre del cupón al estado
                            }));
                        })
                        .catch((error) => {
                            console.error(`Error obteniendo el nombre para el cupón ${cupon.idCupon}:`, error);
                        });
                }
            });
        }
    }, [cuponesFinales]); // Se ejecuta cuando cambian los cupones finales

    /*
    function calcularTotal() {
        return cuponesFinales.reduce((acc, cupon) => acc + cupon.precioF, 0);
    }
    */

    const calcularTotal = () => {


        const cantidadCupones = cartItems.length; // Contar la cantidad de cupones en el carrito

        if (cantidadCupones === 5) {
            return 10000; // Precio fijo para 5 cupones
        } else if (cantidadCupones === 10) {
            return 15000; // Precio fijo para 10 cupones
        } else {
            // Lógica por defecto: 3000 por cupón si no aplican los descuentos
            return cartItems.reduce((acc, item) => acc + item.precioF, 0); // Suponiendo que cada item tiene un precio
        }

        //return cartItems.reduce((acc, item) => acc + item.precioF, 0);
    };

    const handleDeleteCupon = async (id) => {
        try {
            // Llamar a la API para eliminar el cupón final
            await gestionService.deleteCuponFinalById(id);

            // Actualizar la lista de cupones en el estado
            setCuponesFinales((prevCupones) =>
                prevCupones.filter((cupon) => cupon.id !== id)
            );

            // Opcional: También actualizar las plantillas asociadas, si es necesario
            setPlantillasFinales((prevPlantillas) => {
                const { [id]: _, ...rest } = prevPlantillas;
                return rest;
            });

            console.log(`Cupón con ID ${id} eliminado exitosamente.`);
        } catch (error) {
            console.error(`Error al eliminar el cupón con ID ${id}:`, error);
        }
    };

    const handleNavigate = async () => {
        const totalAmount = calcularTotal();
        if (totalAmount <= 0) {
            alert("El carrito está vacío o el total es inválido.");
            return;
        }
        try {
            let sessionId = "Sesion invitada";
            if (isAuthenticated && token) {
                try {
                    const emailFromToken = jwtDecode(token).correo;
                    if (emailFromToken) {
                        sessionId = emailFromToken;
                    } else {
                        console.log("No se encontró un correo en el token, usando 'Sesion invitada'.");
                    }
                } catch (error) {
                    console.error("Error al decodificar el token JWT:", error);
                }
            } else {
                console.log("Usuario no autenticado, usando 'Sesion invitada' como session ID.");
            }
    
            const payload = {
                buyOrder: `BO-${Date.now()}`,
                sessionId: sessionId,
                amount: totalAmount,
                returnUrl: "http://localhost:3000/pago/confirmar",
            };

            const response = await gestionService.iniciarPago(payload);
            if (response.data?.token && response.data?.url) {
                window.location.href = `${response.data.url}?token_ws=${response.data.token}`;
            } else {
                console.error("Error al obtener el token de WebPay", response);
                alert("Hubo un problema al procesar el pago. Por favor, inténtalo nuevamente.");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Hubo un problema con la conexión al servidor. Intenta más tarde.");
        }
    };
    

    return (
        <div className="cart-cupones-list">
            {cartItems.map((item) => (
                <div key={item.id} className="cart-cupon-card">
                    <img
                        src={require(`../assets/Plantillas/Todas/${item.cartImagePath}`)}
                        alt={`Plantilla ${item.cartImagePath}`}
                        className="cart-plantilla-image"
                    />
                    <div className="cart-info">
                        <h3>{item.cuponName || "Cargando..."}</h3>
                        <div className="cart-actions">
                            <button type="submit"  onClick={() => navigate(`/reedit/${item.id}`)} className="editar-button">Editar

                            </button>
                        </div>
                    </div>
                    <span className="cart-precio">${item.precioF.toLocaleString('es-CL')}</span>
                    <img
                        src={trashIcon}
                        alt="trash-icon"
                        className="trash-icon"
                        onClick={() => removeFromCart(item.id)} // Elimina el item del carrito
                    />
                </div>
            ))}

            <div>
                <h3>Resumen del pedido</h3>
            </div>
            <hr className="divider-line"/>
            <div className="cart-total">
                <span className="total-label">Total</span>
                <span className="total-value">${calcularTotal().toLocaleString('es-CL')}</span>
            </div>
            <div>
                <button type="submit" className="cart-buy-button" onClick={handleNavigate}> Finalizar compra</button>
            </div>

        </div>


    );


}

export default CartBodyContent;