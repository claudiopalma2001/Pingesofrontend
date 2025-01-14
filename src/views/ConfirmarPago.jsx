import React, { useState, useEffect  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/ConfirmarPago.css";
import Navbar from "../components/Navbar/Navbar";
import '../components/Navbar/Navbar.css';
import gestionService from '../services/gestion-service';

// Funciones para interactuar con IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cartItems', 1);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject('Error al abrir la base de datos');

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('cupones')) {
        db.createObjectStore('cupones', { keyPath: 'id' });
      }
    };
  });
};
// Función para eliminar la base de datos de IndexedDB
const deleteDatabase = (dbName) => {
  const request = indexedDB.deleteDatabase(dbName);

  request.onsuccess = () => {
    console.log(`La base de datos ${dbName} ha sido eliminada exitosamente.`);
  };

  request.onerror = (event) => {
    console.error(`Hubo un error al intentar eliminar la base de datos ${dbName}:`, event);
  };

  request.onblocked = () => {
    console.log(`La base de datos ${dbName} está bloqueada y no puede ser eliminada en este momento.`);
  };
};

const getCuponesFromDB = () => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction('cupones', 'readonly');
    const store = transaction.objectStore('cupones');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => reject(error);
  });
};
const ConfirmarPago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [detallesTransaccion, setDetallesTransaccion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  /*Para manejar los estados. el usuario no puede salir de la pestaña sin antes haber
  descargado los cupones, los que a su vez deben ser guardados en backend antes de eliminar el carrito */

  const [isDownladed, setIsDownloaded] = useState(false);
  /*Par amanejar el estado de la compra, y evitar que se envien multiples solicitudes al backend */

  const [compraProcesada, setCompraProcesada] = useState(false);
  /*estado para controlar le boton de descarga*/
  const [buttonState, setButtonState]= useState(true);


  const paymentTypeDescriptions = {
    VD: 'Débito',
    VN: 'Crédito',
    VC: 'Crédito en cuotas',
    VP: 'Venta Prepago',
    NC: 'Crédito en cuotas',
    SI: 'Crédito en cuotas',
    S2: 'Crédito en cuotas'
  }; 

  const getQueryParams = (query) => {
    const params = new URLSearchParams(query);
    return { token: params.get('token_ws') };
  };

  const { token } = getQueryParams(location.search);

  const handleAuthorizePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://pingesobackend-production.up.railway.app/api/v1/pago/webpay/commit', null, {
        params: { token_ws: token },
      });

      if (response.status === 200) {
        setDetallesTransaccion(response.data);
      } else {
        setError('No se pudo obtener el estado de la transacción.');
      }
    } catch (err) {
      console.error('Error al autorizar el pago:', err);
      setError('Error al autorizar el pago. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (compraProcesada) {
      navigate('/'); // Redirigir cuando compraProcesada sea true
    }
  }, [compraProcesada]); 

  const handleNavigate = async () => {

  
  // Validar si los detalles de la transacción están disponibles
  if (!detallesTransaccion) {
    console.error("No hay detalles de la transacción disponibles.");
    return;
  }
  if (compraProcesada && isDownladed) {
    await deleteDatabase('cartItems');
    // Evitar realizar la solicitud si la compra ya fue procesada
  }
  if (!compraProcesada && !isDownladed) {
    alert("¡Debe descargar los cupones!")
    // Evitar realizar la solicitud si la compra ya fue procesada
  }


  // Construir la información de la compra

  const correo = detallesTransaccion?.sessionId;

if (!correo) {
  console.error("El sessionId no está definido o es nulo.");
  return; // Salir de la función o manejar el caso donde sessionId sea inválido
}

let userId = 0;

try {
  const response = await axios.get(`https://pingesobackend-production.up.railway.app/api/v1/usuarios/correoId/${correo}`);

  if (response?.data) {
    userId = response.data;
    // Continuar con la lógica que usa el userId
  } else {
    console.warn("El usuario no fue encontrado en la base de datos.");
  }
} catch (error) {
  if (error.response?.status === 404) {
    console.warn("Usuario Invitado. userId establecido en 0.");
    userId = 0;
  } else {
    console.error("Error al obtener el usuario:", error);
    // Manejar otros errores si es necesario
  }
}
const cupones = await getCuponesFromDB();

  const compra = {
    idUsuario: userId,
    fechaCompra: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    montoTotal: detallesTransaccion.amount,
    cuponesFinales: JSON.parse(localStorage.getItem("cartItems"))?.map(cupon => ({
      id: cupon.id.text,
      campoDe: cupon.remitente.text,
      campoPara: cupon.destinatario.text,
      campoIncluye: cupon.contenido.text,
      fecha: "2024-12-21",
      idCupon: cupon.idCupon,
      idUsuario: cupon.userId,
      idPlantilla: 0,
      precioF: 3000,
    })) || []
  };


    try {
    // Enviar la compra al backend
    if(!compraProcesada){
      const response = await axios.post('https://pingesobackend-production.up.railway.app/api/v1/compras/saveCompraWithCupones', compra);
    

    if (response.status === 200) {
      console.log("Compra guardada exitosamente:", response.data);
      /*Seteo el estado de la compra en true, simbolizando que ya fue realizada */
      setCompraProcesada(true);
      /*reviso el estado de la descarga, para saber si es posible continuar o no*/
      
    } else {
        console.error("Error al guardar la compra:", response.statusText);
    }}
    } catch (error) {
        console.error("Error al enviar la compra al backend:", error);
    }
    
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleAuthorizePayment();
    }, 500);

    return () => clearTimeout(timeout); // Limpieza del timeout
  }, []);

  if (loading) {
    return <div className="loading-message">Procesando la transacción...</div>;
  }

  if (error) {
    return (
    <div>
      <Navbar/>
      <div className="error-message">
        <h2>Orden de Compra: {detallesTransaccion?.buyOrder || 'N/A'}</h2>
        <p>Las posibles causas de este rechazo son:
        Error en el ingreso de los datos de su tarjeta de crédito o débito.
        Saldo insuficiente en la tarjeta
        </p>
        <ul>
        </ul>
      </div>
    </div> 
    );
  }

  async function saveFinalCupons() {
   const cupones = await getCuponesFromDB();
    // Validación inicial
    if (!cupons || cupons.length === 0) {
        console.log("No hay cupones para descargar.");
        return;
    }

    try {
        // Procesar todos los cupones en paralelo
        const savePromises = cupons.map((element) => {
            // Validar las propiedades necesarias
            if (
                !element.remitente?.text ||
                !element.destinatario?.text ||
                !element.contenido?.text ||
                !element.datePlaceholder?.text ||
                !element.id ||
                !element.userId
            ) {
                console.log("Faltan campos en el cupón:", element);
                return Promise.resolve(); // Saltar este elemento
            }

            // Guardar los datos en el backend
            return gestionService.saveFinalCupons({
                campoDe: element.remitente.text,
                campoPara: element.destinatario.text,
                campoIncluye: element.contenido.text,
                fecha: element.datePlaceholder.text,
                idCupon: element.id,
                idUsuario: element.userId,
                idPlantilla: 0, // Plantilla predeterminada
                precioF: 3000,
            });
        });

        // Esperar a que se completen todas las promesas
        await Promise.all(savePromises);
        console.log("Todos los cupones fueron guardados en el backend.");
    } catch (error) {
        console.log("Error al guardar los cupones:", error);
    }
}


  {/*Para descargar el cupon (cupones) una vez validado el pago.*/}
  const handleDownload = async () => {
    const cupones = await getCuponesFromDB("cartItems"); // Obtener cupones desde IndexedDB
    if (!cupones || cupones.length === 0) {
      console.log("No hay cupones para descargar.");
      return;
    }

    for (let i = 0; i < cupones.length; i++) {
      const cupon = cupones[i];
      const link = document.createElement('a');
      
      if (cupon.dataURL) {
        link.href = cupon.dataURL;
        const nombreTematica = cupon.nombreTematica || 'cupon';
        const id = cupon.id || i + 1;
        link.download = `${nombreTematica}_cupon_${id}.png`;
        link.click();
        setIsDownloaded(true);
        setButtonState(false);
      } else {
        console.log(`El cupón en el índice ${i} no tiene un dataURL válido.`);
      }
    }
  };

  return (
  <div>
    <Navbar/> 
    <div className="transaction-container">
      {!detallesTransaccion ? (
        <div className="loading-message">Confirmando transacción...</div>
      ) : (
        <>
          {detallesTransaccion.status === 'AUTHORIZED' ? (
            <div className="transaction-details">
              <div className="header">
                <h3>Compra Exitosa</h3>
                <p>Tu transacción se ha completado con éxito.</p>
              </div>
              <div className="details">
                <p><strong>Orden de Compra:</strong> {detallesTransaccion.buyOrder}</p>
                <p><strong>Nombre del Comercio:</strong> 12 Deseos</p>
                <p><strong>Monto:</strong> ${detallesTransaccion.amount.toLocaleString()} CLP</p>
                <p><strong>Código de Autorización:</strong> {detallesTransaccion.authorizationCode}</p>
                <p><strong>Fecha de Transacción:</strong> {new Date(detallesTransaccion.transactionDate).toLocaleString('es-CL')}</p>
                <p><strong>Tipo de Pago:</strong> {paymentTypeDescriptions[detallesTransaccion.paymentTypeCode] || 'N/A'}</p>
                <p><strong>Cantidad de Cuotas:</strong> {detallesTransaccion.installmentsNumber}</p>
                <p><strong>Monto por Cuota:</strong> {(detallesTransaccion.amount / (detallesTransaccion.installmentsNumber || 1)).toLocaleString('es-CL')} CLP</p>
                <button className="redirect-button" onClick={handleNavigate}>
                  Continuar
                </button>
                {
                buttonState ?
                (
                <button className="download-button" onClick={handleDownload}>
                Descargar Cupones
                  </button>) : (
                    <button className="disabled-button" disabled={true} >
                      ¡Cupones Descargados!
                    </button>
                  )
                }
               
              </div>
            </div>
          ) : (
            <div className="error-message">
              <h2>Transacción Rechazada</h2>
              <p>La transacción fue rechazada. Por favor, verifica los detalles de pago.</p>
            </div>
          )}
        </>
      )}
    </div>
  </div> 
  );
};

export default ConfirmarPago;