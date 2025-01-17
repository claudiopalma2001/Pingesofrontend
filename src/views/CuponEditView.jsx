import "@fontsource/alex-brush"; // Importa fuente para todo el proyecto
import "@fontsource/handlee"; // Por defecto carga el estilo normal
import "@fontsource/kalam";
import "@fontsource/asap";
import "@fontsource/crete-round";
import "@fontsource/marck-script";
import "@fontsource/special-elite";
import { useParams } from "react-router-dom";
import "../styles/CuponEditView.css";
import Navbar from "../components/Navbar/Navbar";
import { HexColorPicker } from "react-colorful";
import selectColorIcon from "../../src/assets/Icons/color-picker-dropper-colour.svg";
import { jwtDecode } from "jwt-decode";
import React, { useState, useRef, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext"; // Importar el contexto
import gestionService from "../services/gestion-service";
import StickerBodyContent from "../components/StickerBodyContent/StickerBodyContent";
import CartNotification from "./CartNotification";
import "../styles/CartNotification.css";
import SideBar from "../components/SideBar/SideBar";
import { useOrientation } from 'react-use';

/*Defino las fuentes disponibles*/

const fonts = {
  Asap: "Asap",
  "Crete Round": "Crete Round",
  "Special Elite": "Special Elite",
  "Playwrite IT Moderna": "Playwrite IT Moderna",
};

/*Se define un arreglo que contiene los tamaños en pixeles para las fuentes
 */
const sizes = {
  Grande: "24px",
  Enorme: "28px", // Tamaño grande
  Especial: "40px", //De momento solo la usare para las cursivas con espacios
};


function CuponEditView() {
  const {type}= useOrientation();
 

  /*Debo ver el tema del inicio de sesion y el token, ya qe los
  cupones estan asociados a un usuario en particular (que pasa si no hay usuario?)*/
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setId] = useState(null);
  const token = localStorage.getItem("userJwt");

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

  /*DOM: token jwt
  REC: Setea el id del usuario obtenido a través del token para simobolizar el inicio de sesión en la plataforma*/
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

  /*El siguiente useState sirve para saber si estoy viendo la aplicación desde un dispositivo móvil*/
  /*Primero inicia en "false", el cual cambiará dependiendo del tamaño de pantalla desde el cual esta siendo
  visualizada la aplicación*/
  const [checkMovil, setCheckMovil]= useState(false);


    /*Funcion que permite verificar en tiempo de ejcución si estoy viendo la aplicación
  desde un dispositivo movil.
  
  Para ello, se usa UseEffect para renderizar el componente*/

  useEffect(()=>{
  
    /*Se crea una función dentro de useEffect para detectar si estoy en un dispositivo móvil
    Para ello, detecta el tamaño de pantalla en pixeles y realiza una comparación de ancho*/
  const checkSmartphone=()=>{
    
    if (window.innerWidth >= 300 && window.innerWidth<450) {
      setCheckMovil(true);
      
    }else{
      setCheckMovil(false);
    }
  }

  /*Se ejecuta la función anterior para detectar el tamaño de pantalla*/
  checkSmartphone();
  
    window.addEventListener("resize",checkSmartphone);
    return () =>{
      window.removeEventListener("resize",checkSmartphone);
    }
  },[checkMovil]);

/*-------------------------------------------------------------------------------------------------------------------------------------------------------*/

   
   /*El siguiente useState sirve para detectar si la aplicación esta siendo visualizada a través de un
   dispositivo móvil de forma horizontal*/
   const isLandscape = type;

/*-------------------------------------------------------------------------------------------------------------------------------------------*/



  /*Creo un estado que sirva para almacenar el estado de edicion del lienzo, lo que se debe
  hacer es guardar la informacion para poder re-editar el lienzo*/
  const [ElementsCupon, SetElementsCupon] = useState([]);

  /*Aca veo el tema d elas referencias del input y el boton del input*/
  const dateInputRef = useRef(null); 

  /*Defino un useState para almacenar  el estado de la variable "color" seleccionado para la edicion del cupón */
  const [color, setColor] = useState("#aabbcc");

  /*Defino un useState para almacenar el estado de la variable "precioF", la cual indica el precio de los cupones
  indicados por el cliente de la aplicación */
  const [precioF, setPrecioF] = useState(1990);

  /*Defino un useState para almacenar el estado de la variable "showPicker", la cual indica si la paleta de selección
  de colores es visible una vez presionado el botón que la despliega por pantalla*/
  const [showPicker, setShowPicker] = useState(false);

  /*Función para alternar la visibilidad de la paleta de selección de colores cada vez que se presiona su botón
  de despliegue en la aplicación*/
  const handleTogglePicker = () => {
    setShowPicker(!showPicker);
  };

  /*----------------------------------------------------------------------------------------------------------------------*/

  
  /*Variable useParams que recoge el id y la tematica del cupón seleccionado para la edición */
  const { id, nombreTematica } = useParams();


  /* función que normaliza el nombreTematica y reemplaza caracteres acentuados*/
  const normalizedTematica = nombreTematica
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  /*Variable que almacena el nombre de tematica normalizado junto con el id del cupón seleccionado */
  const cartImagePath = `${normalizedTematica}${id}.png`;
  /*Variable que almacena el nombre de la imagen normalizado junto con el id del cupón seleccionado*/
  const imageName = `${normalizedTematica}/${normalizedTematica}${id}.png`;

  /*-------------------------------------------------------------------------------------------------------------------------*/

  /*Para poder realizar la edición de cupones, se utilizara la propiedad de HTML, el componente "canvas", el cual
  crea un lienzo modificable en el cual se pueden dibujar elementos de forma persistente */

  /*Variable que inicializa en lienzo canvas HTML*/
  const canvasRef = useRef(null);


  /*useState para manejar el estado de la fuente seleccionada por el usuario en la edición del cupón */
  const [selectedFont, SetSelectedFont] =
    useState("Asap");

 /*Función que permite cambiar el valor de la variable "selectedFont" del useState anterior, esto permite poder seleccionar
 el tipo de fuente en tiempo de ejecución*/
  const handleFontChange = (e) => {
    SetSelectedFont(e.target.value);
  };


  /*useState para manejar el estado el tamaño de la fuente seleccionada por el usuario en la edición del cupón*/
  const [selectedfontSize, setSelectedFontSize] = useState(
    sizes.Enorme
  ); 
  
 /*Función que permite cambiar el valor de la variable "selectedFontSize" del useState anterior, esto permite poder seleccionar
 el tamaño de la fuente seleccionada en tiempo de ejecución*/

  const handleFontSizeChange = (e) => {
    setSelectedFontSize(sizes[e.target.value]); // Mapea el tamaño seleccionado a su valor en `sizes`
  };

  /*Ahora se veran los campos editables en el cupón, se incluyen los primeros 3, correspondientes a los campos escritos*/
  const [remitente, setRemitente] = useState("remitente");
  const [destinatario, setDestinatario] = useState("destinatario");
  const [contenido, setContenido] = useState("contenido :)");

  /*variable para el manejo de la fecha en el cupón */
  const [datePlaceholder, setDatePlaceHolder] = useState("");

  
  /*Los siguientes tres manejadores sirven para setear los estados de los campos editables,
  estos campos se actualizan cada vez que se escribe o borra en ellos, ya que corresponden a inputs editables
  en el cupón*/

  const handleRemitente = (e) => {
    setRemitente(e.target.value);
  };


  const handleDestinatario = (e) => {
    setDestinatario(e.target.value);
  };


  const handleContenido = (e) => {
    setContenido(e.target.value);
  };


  /*---------------------------------------------------------------------------------------------------- */
  /*Esta parte es para manejar el estado de el ticket "ahora mismo, será un button que cambie el estado"*/
  const [Check, SetCheck] = useState(false);


  /*Función que cambia el estado de la variable anterior mediante un click, cada vez que se presiona la zona 
  "ahora mismo" presente en el cupón editable*/

  const handleCheckClick = () => {
    SetCheck((Check) => !Check); 
  };


  /*Funcion que obtiene el cupón editable a través de un require. */
  const [imagePath, setImagePath] = useState(null);
  async function fecthCupon(idCupon) {
    try {
      const response = await gestionService.getPlantillaById(idCupon);
    
      setImagePath(
        require(`../assets/Plantillas/Todas/${response.data.urlImagen}`)
      );
    } catch (error) {
      console.error("Imagen no encontrada:", error);
    }
  }

  /*El componente se renderiza cada vez que cambia el cupón a editar, esto permite cambiar el cupón a editar
  dependiendo de su id*/
  useEffect(() => {
    fecthCupon(id);
  }, [id]);

  /* Funcion para formatear la fecha del input para poder tenerla en un formato mas amigable..*/
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Manejo de caso donde no hay fecha

    const [year, month, day] = dateString.split("-"); // Divide el string por los guiones
    return `${day} ${month} ${year.slice(-2)}`; // Devuelve en formato "DD MM YY"
  };

  /*---------------------------------------------------------------------------------------------------------------------------------*/

  /*Ahora se comienza con la edición del cupón*/

  /*useState que sirve para manejar el estado de la imagen cargada en el lienzo, inicialmente en null*/
  const [image, setImage] =
    useState(null); 

  /*Variable de estado que maneja los stickers seleccionados y presentes en el cupón mientras se está editando */
  const [stickers, setStickers] = useState([]);

  /* validador de cantidad de stickers, solo pueden incluirse 2 por cupón
  esta funcion simplemente mide el arreglo de stickers de la variable anterior*/
  const areTwoStickers = () => {
    if (stickers.length == 2) {
      return true;
    }
    return false;
  };


  const [stickerIdCount, setStickerIdCount] = useState(0);
  const [selectedSticker, setSelectedSticker] = useState(null);


    /*Funcion que permite añadir un sticker al arreglo de stickers*/
  // Agregar sticker automáticamente cuando se selecciona uno nuevo
  useEffect(() => {
    if (!selectedSticker) return; // Si no hay sticker seleccionado, no hacer nada

    // Verificar si el sticker ya está en el lienzo
    const stickerExists = stickers.some(
      (existingSticker) => existingSticker.id === selectedSticker.id
    );

    if (stickerExists) {
      return; // No agregarlo si ya está presente
    }

    // Crear un nuevo sticker, para ello se crea una Image(), propiedad de canvas y se asigna como fuente el sticker
    const img = new Image();
    img.src = selectedSticker.image;

    /*Carga los stickers presentes en la carpeta de stickers, en el arreglo de stickers, para ello se asignan propiedades extras a cada sticker
    por ejemplo: tamaño : alto, ancho
    x: poscicion  inicial en el lienzo en la coordenada x
    y: posicion inicial en el lienzo en la coordenada y
    se asigna un id, ya que cada uno será guardado en el arreglo de stickers
    */

    /* En sí, convierte cada imagen de la carpeta stickers presente en assets para despues usarlo en el lienzo*/
    img.onload = () => {
      setStickers((prev) => [
        ...prev,
        {
          id: stickerIdCount,
          x: selectedSticker.x || 50, // Posición x, si no se define, es 50
          y: selectedSticker.y || 50, // Posición y, si no se define, es 50
          width: 170, // Tamaño predeterminado
          height: 170, // Tamaño predeterminado
          image: img,
          imagesrc: img.src,
        },
      ]);
      setStickerIdCount((prevCount) => prevCount + 1); // Incrementar el ID para el próximo sticker
    };

    img.onerror = () => {
      console.error("Error al cargar el sticker:", selectedSticker.image);
    };

    // Limpiar el sticker seleccionado después de agregarlo

    setSelectedSticker(null);
  }, [selectedSticker, stickers, stickerIdCount]);
  
  /*---------------------------------------------------------------------------------------------------------------------------*/


  /*Las siguientes funciones son para el movimiento de los stickers sobre el cupón */

  /*Se definen tanto funciones para mover el sticker con un mouse y de fomra tactil */

  // Función que actualiza el estado en el componente padre
  const handleStickerSelection = (sticker) => {
    setSelectedSticker(sticker); // Actualiza el sticker seleccionado en el estado del padre
  };

  const [moveStartPosition, setMoveStartPosition] = useState(null); // Para almacenar la posición inicial al mover el sticker
  const [isTouching, setIsTouching] = useState(false); // Estado adicional para manejar el toque
  const [isMoving, setIsMoving] = useState(false); // Controlar si el sticker está siendo movido
  const [lastTap, setLastTap] = useState(null); // Último toque para verificar el doble toque, ya que para borrar el sticker en pantallas touch, se realiza con doble toque

  /*Función que permite borrar un sticker desde el lienzo (cupón) mediante el presionado del click derecho*/
  const handleDeleteMouse = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = e.clientX
      ? (e.clientX - rect.left) * scaleX
      : (e.touches[0].clientX - rect.left) * scaleX;
    const y = e.clientY
      ? (e.clientY - rect.top) * scaleY
      : (e.touches[0].clientY - rect.top) * scaleY;

    const clickedSticker = stickers.find(
      (sticker) =>
        x >= sticker.x &&
        x <= sticker.x + sticker.width &&
        y >= sticker.y &&
        y <= sticker.y + sticker.height
    );

    if (clickedSticker) {
      setStickers((prevStickers) =>
        prevStickers.filter((sticker) => sticker.id !== clickedSticker.id)
      );
    }
  };

  /*Funcion que permite borrar un sticker del cupón en una pantalla táctil mediante 2 toques consecutivos */
  const handleTouchDelete = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

    const clickedSticker = stickers.find(
      (sticker) =>
        x >= sticker.x &&
        x <= sticker.x + sticker.width &&
        y >= sticker.y &&
        y <= sticker.y + sticker.height
    );

    if (clickedSticker) {
      const now = Date.now();

      // Si el tiempo entre los toques es corto, es un doble toque
      if (lastTap && now - lastTap.time < 500) {
        if (clickedSticker.id === lastTap.sticker.id) {
          // Doble toque: eliminamos el sticker
       

          setStickers((prevStickers) =>
            prevStickers.filter((sticker) => sticker.id !== clickedSticker.id)
          );
        }
      } else {
        // Si no es doble toque, comenzamos el movimiento
        setIsMoving(true);
        setSelectedSticker(clickedSticker);
        setIsTouching(true); // Iniciamos el modo de "tocando"
      }

      // Actualizamos el último toque
      setLastTap({ sticker: clickedSticker, time: now });
    }
  };

  /*Funcion que permite mover un sticker cen el cupón con el mouse de la computadora, para ello se mantiene presionado
  y se arrastra por el cupón*/
  const handleMouseMove = (e) => {
    if (!selectedSticker) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Factor de escala considerando el zoom de la pantalla
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Ajustamos las coordenadas del mouse
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Calcular el nuevo sticker
    const updatedSticker = {
      ...selectedSticker,
      x: x - selectedSticker.offsetX,
      y: y - selectedSticker.offsetY,
    };

    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === selectedSticker.id ? updatedSticker : sticker
      )
    );
  };

  /*Funcion que permite mover un sticker dentro dle cupón en una pantalla táctil, para ello se mantiene
  presionado y se mueve a través del cupón */
  const handleTouchMove = (e) => {
    if (!isMoving || !selectedSticker) return; // No hacer nada si no estamos moviendo el sticker

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

   
    // Actualizar el sticker con las nuevas coordenadas
    const updatedSticker = {
      ...selectedSticker,
      x: x - selectedSticker.offsetX,
      y: y - selectedSticker.offsetY,
    };
   

    setStickers((prevStickers) =>
      prevStickers.map((sticker) =>
        sticker.id === selectedSticker.id ? updatedSticker : sticker
      )
    );
  };

  /*Función que maneja el estado del sticker seleccionado cuando se deja de mover en el cupón mediante un mouse*/
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Factor de escala considerando el zoom de la pantalla
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calcula las coordenadas ajustadas por el zoom
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Detecta si el clic está dentro de un sticker
    const clickedSticker = stickers.find(
      (sticker) =>
        x >= sticker.x &&
        x <= sticker.x + sticker.width &&
        y >= sticker.y &&
        y <= sticker.y + sticker.height
    );

    if (clickedSticker) {
      canvas.style.cursor = "grab";

      setSelectedSticker({
        ...clickedSticker,
        offsetX: x - clickedSticker.x,
        offsetY: y - clickedSticker.y,
      });
    }
  };


  /*Función que maneja el estado del sticker seleccionado una vez se deja de mover en el cupón cuando se usa una pantalla táctil */
  const handleTouchDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Factor de escala considerando el zoom de la pantalla
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

    // Detecta si el clic está dentro de un sticker
    const clickedSticker = stickers.find(
      (sticker) =>
        x >= sticker.x &&
        x <= sticker.x + sticker.width &&
        y >= sticker.y &&
        y <= sticker.y + sticker.height
    );

    if (clickedSticker) {
      canvas.style.cursor = "grab";

      // Si no estamos tocando un sticker para eliminar, lo movemos
      if (!isTouching) {
        setSelectedSticker({
          ...clickedSticker,
          offsetX: x - clickedSticker.x,
          offsetY: y - clickedSticker.y,
        });
       
      }
    }
  };

  /*Funcion que maneja el temrino de movimiento del sticker con un mouse */
  const handleMouseUp = () => {
    setSelectedSticker(null); // Descartamos el sticker seleccionado cuando se deja de presionar el mouse
    const canvas = canvasRef.current;
    canvas.style.cursor = "default";
  };

  /*Funcion que m anejra el termino de movimiento del sticker en  pantallas tactiles */

  const handleTouchEnd = () => {
    setIsMoving(false); // Terminamos el movimiento
    setIsTouching(false); // Terminamos el toque
    setMoveStartPosition(null); // Limpiamos la posición de inicio
  };



  /*Esta funcion dibuja los stickers seleccionados en el lienzo, para ello recorre el arreglo de stickers
  */
  const drawStickers = (ctx) => {
    stickers.forEach((sticker) => {
      ctx.drawImage(
        sticker.image, // Usa la imagen precargada
        sticker.x,
        sticker.y,
        sticker.width,
        sticker.height
      );
    });
  };


  // Cargar la imagen : Acá primeramente se carga el lienzo canvas con el cupon seleccionado.

  useEffect(() => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      setImage(img);
    };
  }, [imagePath]);

  /*Esta funcion sirve para encontrar el sticker seleccionado desde el arreglo, para poder realizar el movimiento y demases
  en el lienzo del cupón seleccionado
  */



  /*--------------------------------------------------------------------------------------------------------------------------------*/


  // Dibuja la imagen y los placeholders en el canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = imagePath;

    function drawCupon() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
      //Aca se dibuja el cupon en el lienzo
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
    }

    const drawCheck = (ctx, isChecked, x, y) => {
      // Configuración específica para el "Check"
      ctx.font = "24px Arial"; // Fuente del "Check"
      ctx.fillStyle = "black";
      // Dibujar el check o un símbolo alternativo
      ctx.fillText(isChecked ? "✔" : "", x, y);
    };

    /*Esta función dibuja los placeholders en el canvas*/
    const drawPlaceHolders = (ctx) => {
      // Dibujar los placeholders
      // Dibuja los textos sobre la imagen
      ctx.font = `${selectedfontSize} ${selectedFont}`;
      ctx.fillStyle = color;

      ctx.fillText(remitente, 380, 300); // Posición de remitente
      ctx.fillText(destinatario, 830, 300); // Posición de destinatario
      ctx.fillText(contenido, 420, 340); // Posición de contenido
    };

    const drawDate = (ctx) => {
      const dateInput = dateInputRef.current; // Obtén el input desde la referencia
      dateInput.addEventListener("change", () => {
        const dateValue = dateInput.value; // Obtener el valor del input
        setDatePlaceHolder(formatDate(dateValue)); //aca seteo la fecha con el nuevo formato
      });

      ctx.font = `23px ${selectedFont}`;
      ctx.fillStyle = color;

      ctx.fillText(`${datePlaceholder}`, 832, 387); // Ajusta las coordenadas
    };

    image.onload = () => {
      // Dibuja la imagen en el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
      drawCupon(); /*aca se dinuja l aplantilla como background y stickers encima, por temas de test se comento la linea que dibuja el sticker*/
      /*Dibujo los placeHolders */
      drawPlaceHolders(ctx);
      /*Dibujo los stickers */
      drawStickers(ctx);

      ctx.save();
      /*Dibujo el check*/
      drawCheck(ctx, Check, 570, 385);

      ctx.restore();
      ctx.save();
      drawDate(ctx);
      ctx.restore();

      /****************************************/
    };
  };

  // UseEffect para manejar eventos de mouse
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Event listeners de mouse
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("contextmenu", handleDeleteMouse);

    // Cleanup al desmontar el componente
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("contextmenu", handleDeleteMouse);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleDeleteMouse]);

  // UseEffect para manejar eventos táctiles
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Event listener de touchstart para manejar tanto el eliminar como el mover
    const onTouchStart = (e) => {
      e.preventDefault();
      handleTouchDelete(e); // Primero intentamos eliminar si es un doble toque
      handleTouchDown(e); // Si no es para eliminar, se maneja el movimiento
    };

    // Agregar los event listeners
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Cleanup: eliminar los event listeners
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd, handleTouchDelete, handleTouchDown]);


  /*Este useEffect permite redibujar el canvas cada vez que cambia alguna de sus dependencias.
  esto en si permite la actualizacion del estado general de edicion del cupón de forma instantanea*/
  useEffect(() => {
    if (imagePath) {
      drawCanvas();
    }
  }, [
    imagePath,
    remitente,
    destinatario,
    contenido,
    selectedFont,
    selectedfontSize,
    color,
    Check,
    datePlaceholder,
    stickers,
    checkMovil
  ]);

  /**Lo siguiente es para, una vez finalizada la edición del cupón, agregarlo al carrito*/

 

  const [cuponName, setCuponName] = useState(""); // Estado inicial vacío
  const [cuponPrecio, setCuponPrecio] = useState(0); // Estado inicial vacío
  useEffect(() => {
    if (id) {
      gestionService
        .getCuponesById(id)
        .then((response) => {
          if (response && response.data && response.data.nombreCupon) {
            setCuponName(response.data.nombreCupon); // Actualiza el estado con el nombre del cupón
            setCuponPrecio(response.data.precio);
          }
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del cupón:", error);
        });
    }
  }, [id]); // Ejecuta el efecto cuando `id` cambie

  const [showNotification, setShowNotification] = useState(false);
  const [notificationItem, setNotificationItem] = useState("");
  const [notificationImage, setNotificationImage] = useState("");


  
  const { addToCart } = useContext(CartContext); // Accede a la función `addToCart`

  /*Esta funcion permite guardar el cupón en el carrito de comrpas.. el carrito
  funcionará usando indexedDB, que a diferencia de locla storage, no tendrá problemas por limitación de memoria*/
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas no está disponible o no ha sido inicializado.");
      return;
    }
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${nombreTematica}_cupon_${id}.png`;
  
    // Información del cupón
    const nuevoCupon = {
      id: Date.now(),
      userId: userId || null, // Asegúrate de manejar el caso donde userId es null
      cartImagePath: cartImagePath,
      cuponName: cuponName,
      precioF: cuponPrecio, // Asegúrate de que precioF tenga un valor válido
      stickers: stickers, // Esto es un arreglo
      remitente: { text: remitente, x: 380, y: 300 },
      destinatario: { text: destinatario, x: 830, y: 300 },
      contenido: { text: contenido, x: 420, y: 340 },
      font: selectedFont,
      fontSize: selectedfontSize,
      color,
      check: { value: Check, x: 570, y: 385 },
      datePlaceholder: { text: datePlaceholder, x: 832, y: 387 },
      dataURL,
      idCupon: id,
      nombreTem: nombreTematica,
    };
  
    // Función para abrir la base de datos
    const openDB = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('cartItems', 1);
  
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
  
        request.onerror = (event) => {
          reject(new Error('Error al abrir la base de datos.'));
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('cupones')) {
            db.createObjectStore('cupones', { keyPath: 'id' }); // Creamos el almacén con clave primaria 'id'
          }
        };
      });
    };
  
    // Función para guardar un cupón en la base de datos
    const saveCuponToDB = async (nuevoCupon) => {
      try {
        const db = await openDB();
        const transaction = db.transaction('cupones', 'readwrite'); // Abrir transacción de lectura/escritura
        const store = transaction.objectStore('cupones');
        store.add(nuevoCupon); // Guardar el cupon en la base de datos
        await transaction.complete; // Esperar a que la transacción termine
     
      } catch (error) {
        console.error("Error al guardar el cupón en la base de datos:", error);
      }
    };
  
    // Guardar el cupón en la base de datos
    await saveCuponToDB(nuevoCupon);
  
    // Añadir el cupón al carrito
     await addToCart(nuevoCupon); 
  
    // Actualizar el estado de la UI
    SetElementsCupon(nuevoCupon);
    setNotificationItem(nuevoCupon.cuponName);
    setShowNotification(true);
    setNotificationImage(nuevoCupon.cartImagePath);
  
    // Ocultar notificación después de 5 segundos
    setTimeout(() => setShowNotification(false), 5000);
  };
  
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setSidebarVisible(false);
  };


  /*variable de estado para ocultar las herramientas de edicion*/
  const [isToolsVisible, setIsToolsVisible] = useState(false);
  const toggleDiv = () => {
    setIsToolsVisible(!isToolsVisible);
  }

  console.log("orientacion", isLandscape);
  
  
  return (
    <>
      

      {isLandscape === "portrait-primary"? (  <><Navbar toggleSidebar={toggleSidebar} />
      <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} /></>) : 
      (<div style={{display:"none"}}></div>)}
    
    { checkMovil? (<div className="message"> Rote la pantalla para editar el cupón!</div>):
     ( <div className="cupon-edit-view-container">
        {
          
          isLandscape === "portrait-primary" ? (
        <div>
          <div className="cupon-edit-view-tools">
            <div className="cupon-category-name" style={{alignContent:"flex-start", display:"flex", flexDirection:"column", textAlign:"left"
              , fontWeight:"bold"
            }}>
              <h2 className="handlee-text" style={{margin:"0", fontSize: "3vw" , fontFamily: 'Inria Sans', color: "#7e858d"}}>
                {nombreTematica}
              </h2>
              <div style={{fontFamily: 'Inria Sans'}}>Personaliza tu cupón y hazlo único!</div>
              <div style={{fontFamily: 'Inria Sans', color:"#7e858d"}}>Ahora elige la letra, el color y el sticker que más te guste.</div>
            </div>

            <div className="font-edit-tools">
              <select
                style={{ fontFamily: selectedFont }}
                className="font-selector"
                value={selectedFont}
                onChange={handleFontChange}
              >
                {Object.keys(fonts).map((font, index) => (
                  <option style={{ fontFamily: font }} key={index} value={font}>
                    {font}
                  </option>
                ))}
              </select>

              {/*Selector de tamaño de fuente*/}
              <select
                className="size-selector"
                value={Object.keys(sizes).find(
                  (key) => sizes[key] === selectedfontSize
                )} // Mapea el valor correctamente
                onChange={handleFontSizeChange}
              >
                {Object.keys(sizes).map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="color-selector"
                onClick={handleTogglePicker}
              >
                <img
                  src={selectColorIcon}
                  alt="select-color-icon"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>

              {/*Componente a encajar la seleccion de stickers */}
              {!areTwoStickers() && (
                <StickerBodyContent
                  className="Sticker-Component"
                  onStickerSelect={handleStickerSelection}
                />
              )}

              {areTwoStickers() && (
                <div
                  className="full-message"
                  style={{
                    position: "relative",
                    width: "100%",
                    fontSize: "15px",
                    alignSelf: "center",
                    zIndex: 9999,
                  }}
                >
                  ¡Stickers Maximos Alcanzados!
                </div>
              )}

              <div
                className={`picker-container ${showPicker ? "visible" : ""}`}
              >
                <HexColorPicker
                  color={color}
                  onChange={(newColor) => {
                 
                    setColor(newColor);
                  }}
                />
              </div>
            </div>
            {stickers.length>0 && (<p
                className="help-text"
                style={{
                  textAlign: "center",
                  color: "#7c7c7c",
                  fontFamily: "Inria Sans",
                }}
              >
                Para eliminar el sticker, presione click derecho encima de él
              </p>)}
          </div>
        </div>
          ) : ( 
          <div className="tools-container">
            <div className="cupon-edit-view-tools" style={{ visibility: isToolsVisible ? 'visible' : 'hidden'}}>
              <div className="cupon-category-name">
                <h2 className="handlee-text" style={{ fontSize: "3vw" }}>
                  {nombreTematica}
                </h2>
              </div>
  
              <div className="font-edit-tools">
                <select
                  style={{ fontFamily: selectedFont }}
                  className="font-selector"
                  value={selectedFont}
                  onChange={handleFontChange}
                >
                  {Object.keys(fonts).map((font, index) => (
                    <option style={{ fontFamily: font }} key={index} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
  
                {/*Selector de tamaño de fuente*/}
                <select
                  className="size-selector"
                  value={Object.keys(sizes).find(
                    (key) => sizes[key] === selectedfontSize
                  )} // Mapea el valor correctamente
                  onChange={handleFontSizeChange}
                >
                  {Object.keys(sizes).map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
  
                <button
                  type="button"
                  className="color-selector"
                  onClick={handleTogglePicker}
                >
                  <img
                    src={selectColorIcon}
                    alt="select-color-icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>
  
                {/*Componente a encajar la seleccion de stickers */}
                {!areTwoStickers() && (
                  <StickerBodyContent
                    className="Sticker-Component"
                    onStickerSelect={handleStickerSelection}
                  />
                )}
  
                {areTwoStickers() && (
                  <div
                    className="full-message"
                    style={{
                      position: "relative",
                      width: "100%",
                      fontSize: "15px",
                      alignSelf: "center",
                      zIndex: 9999,
                    }}
                  >
                    ¡Stickers Maximos Alcanzados!
                  </div>
                )}
  
                <div
                  className={`picker-container ${showPicker ? "visible" : ""}`}
                >
                  <HexColorPicker
                    color={color}
                    onChange={(newColor) => {
                      
                      setColor(newColor);
                    }}
                  />
                </div>
              </div>
             
            </div>
            <button type="button" className="toogle-tool-div" onClick={toggleDiv}>
        {isToolsVisible ? "<": '>'}
      </button>

          </div>)}

        <div className="cupon-image-container">
          {/* Aquí está el canvas que dibujará la imagen y los placeholders */}
          <canvas
            ref={canvasRef}
            width={1366} // Tamaño del canvas, igual al de la imagen
            height={590}
            style={{ border: "1px solid #000" }}
            className="canvas-cupon"
          />

          {/*Acá se calzan los placeHolders*/}

          {/*Placeholder para el remitente*/}
          <input
            type="text"
            style={{
              fontFamily: selectedFont,
              fontSize: selectedfontSize, // Se usa el tamaño con la unidad 'px'
              color: color,
            }}
            className="first-cupon-image-placeholder"
            value={remitente}
            onChange={handleRemitente}
          />
          {/*Placeholder para el Destinatario*/}
          <input
            type="text"
            style={{
              fontFamily: selectedFont,
              fontSize: selectedfontSize,
              color: color,
            }}
            className="second-cupon-image-placeholder"
            value={destinatario}
            onChange={handleDestinatario}
          />
          {/*Placeholder para el contenido*/}

          <input
            type="text"
            style={{
              fontFamily: selectedFont,
              fontSize: selectedfontSize,
              color: color,
            }}
            className="third-cupon-image-placeholder"
            value={contenido}
            onChange={handleContenido}
          />

          {/*boton para manejar el estado del check "Ahora mismo"*/}
          <button className="btn-check" onClick={handleCheckClick}>
            {Check ? "✔" : ""}
          </button>
            {/*Input para manejar la fecha*/}
            <div className="date-container">
            <input type="date" className="dateInput" ref={dateInputRef} />
          </div>

          {/*Boton para agregar al carrito*/}
          <button
            type="button"
            className="add-cart-button"
            onClick={handleSave}
          >
            Agregar al carrito
          </button>
        </div>
        {/* Notificación */}
        {showNotification && (
          <CartNotification
            show={showNotification}
            itemName={notificationItem}
            itemImage={notificationImage}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>)

}
    </>
  );
}

export default CuponEditView;
