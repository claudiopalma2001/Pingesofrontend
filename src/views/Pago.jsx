import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Pago.css"; // Agrega este archivo CSS para los estilos

const Pago = () => {
  const location = useLocation();  // Accedemos al estado pasado desde el carrito
  const navigate = useNavigate();  // Para navegación después del error
  const [buyOrder, setBuyOrder] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [amount, setAmount] = useState(location.state?.amount || "");  // Usamos el monto pasado
  const [returnUrl, setReturnUrl] = useState("https://main.d26i076z7d4xot.amplifyapp.com/pago/confirmar");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (!buyOrder) {
      setBuyOrder(`BO-${Date.now()}`); // Generar buyOrder único
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setTransactionDetails(null);

    const payload = {
      buyOrder,
      sessionId: sessionId || "Sesión Predeterminada", // Placeholder
      amount,
      returnUrl,
    };

    try {
      const response = await axios.post("https://pingesobackend-production.up.railway.app/api/v1/pago/webpay", payload);
      if (response.data?.token && response.data?.url) {
        setTransactionDetails({
          token: response.data.token,
          url: response.data.url,
        });

        // Redirigir automáticamente a la URL de WebPay
        window.location.href = `${response.data.url}?token_ws=${response.data.token}`;
      } else {
        setErrorMessage("Error al obtener el token de la transacción.");
      }
    } catch (error) {
      setErrorMessage("Error al crear la transacción. Intenta nuevamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar si el estado de la transacción indica que hubo un error
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');  // Ejemplo: "rejected" o "failed"
    
    if (status === 'REJECTED' || status === 'FAILED') {
      setErrorMessage("Tu transacción no se pudo llevar a cabo. Ningún cargo fue realizado en su tarjeta, por favor intente nuevamente.");
      setTimeout(() => {
        navigate("/carrito");  // Redirigir al carrito después de mostrar el mensaje de error
      }, 3000);
    }
  }, [navigate]);

  return (
    <div className="pago-container">
      <h2 className="title">Formulario de Transacción Webpay</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form className="pago-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Buy Order:</label>
          <input
            type="text"
            value={buyOrder}
            onChange={(e) => setBuyOrder(e.target.value)}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Session ID:</label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Sesión Predeterminada"
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Return URL:</label>
          <input
            type="text"
            value={returnUrl}
            readOnly
          />
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Cargando..." : "Crear Transacción"}
        </button>
      </form>

      {transactionDetails && (
        <div className="transaction-details">
          <h3>Detalles de la Transacción</h3>
          <p><strong>Token:</strong> {transactionDetails.token}</p>
          <p><strong>URL de Pago:</strong> {transactionDetails.url}</p>
        </div>
      )}
    </div>
  );
};

export default Pago;
