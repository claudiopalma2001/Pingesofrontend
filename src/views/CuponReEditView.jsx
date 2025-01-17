import "@fontsource/alex-brush"; // Importa fuente para todo el proyecto
import "@fontsource/handlee"; // Por defecto carga el estilo normal
import "@fontsource/kalam";
import "@fontsource/asap";
import "@fontsource/crete-round"; 
import "@fontsource/marck-script";
import "@fontsource/special-elite"
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
/*Defino las fuentes disponibles*/
/*TODO: ver el tema de la fuente similar a la enviada por la clienta*/
const fonts = {
  Asap: "Asap",
  "Crete Round":"Crete Round",
  "Special Elite": "Special Elite",
   "Playwrite IT Moderna": "Playwrite IT Moderna"

};

/*defino algunos tamaños de prueba*/
const sizes = {
  Grande: "24px",
  Enorme: "28px", // Tamaño grande
  Especial: "40px", //De momento solo la usare para las cursivas con espacios
};
/*Aca seguramente debe entrar la informacion del arreglo de cupones, para poder
reeditar un cupon! */

function CuponReEditView() {
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

 

  /*Creo un estado que sirva para almacenar el estado de edicion del lienzo, lo que se debe
  hacer es guardar la informacion para poder reeditar el lienzo*/
  const [ElementsCupon, SetElementsCupon] = useState([]);


  /*Aca veo el tema d elas referencias del input y el boton del input*/
  const dateInputRef = useRef(null); // Referencia al input de tipo fecha
  /*Defino el estado del color */
  const [color, setColor] = useState("#aabbcc");

  const [precioF, setPrecioF] = useState(3000); //Precio establecido por las clientas

  const [showPicker, setShowPicker] = useState(false);

  // Función para alternar la visibilidad del selector
  const handleTogglePicker = () => {
    setShowPicker(!showPicker);
  };
  const { id } = useParams(); // Obtén el id desde los parámetros de la URL
 
   // Función para buscar el cupón en localStorage
   useEffect(() => {
    
     const cupones = JSON.parse(localStorage.getItem("cartItems"));
     if (!cupones) {
       console.log("No hay cupones en el carrito");
       return;
     }
 
     // Buscar el cupón en el array
     const cuponEncontrado = cupones.find(cupon => cupon.id === parseInt(id));
     if (cuponEncontrado) {
       SetElementsCupon(cuponEncontrado); // Establecer el cupón en el estado
       console.log("Cupón encontrado:", cuponEncontrado);
     } else {
       console.log("Cupón no encontrado");
     }
   }, []); // Usar un arreglo vacío como dependencia para que se ejecute solo una vez al montar el componente
 
   // Extraer el nombre de la temática del cupón si existe
   const nombreTematica = ElementsCupon?.nombreTem || "Temática no definida";
   console.log("Nombre temática:", nombreTematica);
 

  console.log("cupon",ElementsCupon);
  

  // Normaliza el nombreTematica y reemplaza caracteres acentuados
  const normalizedTematica = nombreTematica
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();


  const cartImagePath = `${normalizedTematica}${id}.png`;
  const imageName = `${normalizedTematica}/${normalizedTematica}${id}.png`;

  /*Se usara canvas para preparar un lienzo editable con los campos de la imagen*/
  const canvasRef = useRef(null);

  /*Para manejar el estado de la fuente actual.. la seleccionada*/
  const [selectedFont, SetSelectedFont] =
    useState("Handlee"); /* por default handlee*/

  const handleFontChange = (e) => {
    SetSelectedFont(e.target.value);
  };

  /*Esto es para manejar el tamaño de la fuente*/
  const [selectedfontSize, setSelectedFontSize] = useState(
    sizes.Enorme
  ); /*por defecto 12px*/
  const handleFontSizeChange = (e) => {
    setSelectedFontSize(sizes[e.target.value]); // Mapea el tamaño seleccionado a su valor en `sizes`
  };

  const [remitente, setRemitente] = useState(ElementsCupon.remitente ? ElementsCupon.remitente.text : "");
  const [destinatario, setDestinatario] = useState(ElementsCupon.destinatario ? ElementsCupon.destinatario.text : "");
  const [contenido, setContenido] = useState(ElementsCupon.contenido ? ElementsCupon.contenido.text : "");
  const [datePlaceholder, setDatePlaceHolder] = useState(ElementsCupon.datePlaceholder ? ElementsCupon.datePlaceholder.text : "");
  useEffect(() => {
    if (ElementsCupon) {
      setRemitente(ElementsCupon.remitente?.text || "");
      setDestinatario(ElementsCupon.destinatario?.text || "");
      setContenido(ElementsCupon.contenido?.text || "");
      setDatePlaceHolder(ElementsCupon.datePlaceholder?.text || "");
      setColor(ElementsCupon?.color || "#aabbcc");
      setSelectedFontSize(ElementsCupon?.fontSize || "24px");
      setStickers(ElementsCupon?.sticekrs || []);
    }
  }, [ElementsCupon]);
  
  const handleRemitente = (e) => {
    setRemitente(e.target.value);
  };

  /*manejadores de estado*/
  const handleDestinatario = (e) => {
    setDestinatario(e.target.value);
  };

  /*manejadores de estado*/
  const handleContenido = (e) => {
    setContenido(e.target.value);
  };

  /*Esta parte es para manejar el estado de el ticket "ahora mismo, sera un button que cambie el estado"*/
  const [Check, SetCheck] = useState(false);

  const handleCheckClick = () => {
    SetCheck((Check) => !Check); // Alterna el estado
  };

  // Intenta cargar la imagen con `require`
  const [imagePath, setImagePath] = useState(null);
  async function fecthCupon() {
    try {
      setImagePath(
        require(`../assets/Plantillas/Todas/${ElementsCupon.cartImagePath}`)
      );
    } catch (error) {
      console.error("Imagen no encontrada:", error);
    }
  }

  useEffect(() => {
    fecthCupon(id);
  });

  /* Funcion para formatear la fecha del input para poder tenerla en un formato mas amigable..*/

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Manejo de caso donde no hay fecha

    const [year, month, day] = dateString.split("-"); // Divide el string por los guiones
    return `${day} ${month} ${year.slice(-2)}`; // Devuelve en formato "DD MM YY"
  };

  /*Ahora se opera con el canvas*/

  const [image, setImage] =
    useState(null); /*Para manejar el estado de la imagen cargada */

  /*Para manejar el estado del sticker cargado: queda a implementar una version como arrays de estado para manejar
    multiples estados y stickers.*/
  /*Funciona como un array, ya que serán varios los stickers a aplicar
    
    TODO: posible limitacion de stickers en un lienzo (Quizá considerando las membresías)
    */

  const [stickers, setStickers] = useState([]);
  /* validador de cantidad de stickers, solo pueden incluirse 2 por cupón*/
  const areTwoStickers =() =>{
    if ( stickers != null && stickers.length == 2) {
      return true;
      
    }return false;
  }

  /*Funcion que permite añadir un sticker al arreglo de stickers*/
  //src es la ruta fuente, estará parametrizada
  const [stickerIdCount, setStickerIdCount] = useState(0);
  const [selectedSticker, setSelectedSticker] = useState(null);

   // Agregar sticker automáticamente cuando se selecciona uno nuevo
   useEffect(() => {
    if (!selectedSticker) return; // Si no hay sticker seleccionado, no hacer nada

    // Verificar si el sticker ya está en el lienzo
    const stickerExists = stickers.some(
      (existingSticker) => existingSticker.id === selectedSticker.id
    );

    if (stickerExists) {
      console.log("El sticker ya está en el lienzo.");
      return; // No agregarlo si ya está presente
    }

    // Crear un nuevo sticker
    const img = new Image();
    img.src = selectedSticker.image;

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
        },
      ]);
      setStickerIdCount((prevCount) => prevCount + 1); // Incrementar el ID para el próximo sticker
    };

    img.onerror = () => {
      console.error("Error al cargar el sticker:", selectedSticker.image);
    };

    // Limpiar el sticker seleccionado después de agregarlo
    setSelectedSticker(null);

  }, [selectedSticker, stickers, stickerIdCount]); // Solo depende de selectedSticker

 

  /*Las siguientes funciones son para el movimiento de los stickers sobre el cupón */

  /*Primero defino un useState para el sticker seleccionado*/


  // Función que actualiza el estado en el componente padre
  const handleStickerSelection = (sticker) => {
    setSelectedSticker(sticker); // Actualiza el sticker seleccionado en el estado del padre
  };

  /*Funcionnqu epermite eliminar un sticker con el click derecho, mientras se pulsa en el*/
  const handleContextMenu = (e) => {
    e.preventDefault();
  
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
  
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
  
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
  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener("contextmenu", handleContextMenu);
  
    return () => {
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [stickers]);
  
  

  /* Defino las funciones de movimiento*/

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
    const updatedSticker = {
      ...selectedSticker,
      x: x + selectedSticker.offsetX,
      y: y + selectedSticker.offsetY,
    };

    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === selectedSticker.id ? updatedSticker : sticker
      )
    );
  };

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
        offsetX: x - (clickedSticker.x + clickedSticker.width),
        offsetY: y - (clickedSticker.y + clickedSticker.height),
      });
    }
  };

  const handleMouseUp = () => {
    setSelectedSticker(null); // Descartamos el sticker seleccionado cuando se deja de presionar el mouse
    const canvas = canvasRef.current;
    canvas.style.cursor = "default";
  };

  /*Esta funcion dibuja los stickers seleccionados en el lienzo*/
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

  /*Aca agrego los eventListeners a al canvas */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Cleanup al desmontar el componente
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

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
    ElementsCupon
  ]);

  /*Defino lo que tiene el cupon, basicamente es */
  /*
  Plantilla del cupon
  stickers
  placeholders con el color adecuado, ademas de los checks y fechas
  
  */

  const { addToCart } = useContext(CartContext); // Accede a la función `addToCart`

  const [showNotification, setShowNotification] = useState(false);
  const [notificationItem, setNotificationItem] = useState("");
  const [notificationImage, setNotificationImage] = useState("");

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas no está disponible o no ha sido inicializado.");
      return;
    }
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${nombreTematica}_cupon_${id}.png`;
    
    const nuevoCupon = {
      id: ElementsCupon.id,
      userId: ElementsCupon.userId, // Asegúrate de que userId tenga un valor válido // aca existe la posibilidad de que sea null debido a usuarios no registrados
      cartImagePath: ElementsCupon.cartImagePath,
      cuponName: ElementsCupon.cuponName,
      precioF: ElementsCupon.precioF, // Asegúrate de que precioF tenga un valor válido, como "3000"
      stickers, //Esto es un arreglo, notar eso, quiza se cambie el backend?
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
      nombreTem: ElementsCupon.nombreTem
    };
    SetElementsCupon(nuevoCupon);
    /*Actualizo el cupon en el carrito*/
    
    //alert("Cupón agregado al carrito")

    // Actualiza la notificación con el nombre del cupón
    setNotificationItem(nuevoCupon.cuponName);
    setShowNotification(true);
    setNotificationImage(nuevoCupon.cartImagePath);

    /*Lo guardo de forma momentanea en el navegador para poder utilizarlo en el carrito*/
  

    // Ocultar notificación después de 5 segundos
    setTimeout(() => setShowNotification(false), 5000);
    
    
  };


  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setSidebarVisible(false);
  }

  return (
    <>
    {/*Se debe revisar la implementacion en caso de que se venga desde el carrito
    debido a una reediocion del cupon, ver eso, si es asi, la informacion
    momentanea ha de recuperarse desde localStorage */}

      {/*Navbar*/}
      <Navbar toggleSidebar={toggleSidebar}/>
      <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
      <div className="cupon-edit-view-container">
        <div>
          <div className="cupon-edit-view-tools">
            <div className="cupon-category-name">
              <h2 className="handlee-text" style={{ fontSize: "3vw" }}>
                {nombreTematica}
              </h2>
            </div>

            <div className="font-edit-tools">
              {/*Aca esta el selector de fuentes disponible.*/}

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
              { !areTwoStickers() && (<StickerBodyContent
                className="Sticker-Component"
                onStickerSelect={handleStickerSelection}
              />)}
      
              {areTwoStickers() && (
                     <div className="full-message" style={{position:"relative",width: "100%", fontSize: "15px", alignSelf:"center", zIndex:9999}}>
                     ¡Stickers Maximos Alcanzados!
                   </div>
              )}

              <div
                className={`picker-container ${showPicker ? "visible" : ""}`}
              >
                <HexColorPicker
                  color={color}
                  onChange={(newColor) => {
                    console.log("Nuevo color seleccionado:", newColor);
                    setColor(newColor);
                  }}
                />
             
          </div>
          </div>
               <p style={{
                textAlign: "center",
                color: "#7c7c7c",
                fontFamily:"Inria Sans",
               }}>Para eliminar el sticker, presione click derecho encima de él</p>
            </div>
        </div>

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
          <input type="date" id="dateInput" ref={dateInputRef} />

          {/*Boton para agregar al carrito*/}
          <button type="button" onClick={handleSave}>
            Finalizar Re-edición
           
          </button>
        </div>
        {/* Notificación */}
        <CartNotification
            show={showNotification}
            itemName={notificationItem}
            itemImage={notificationImage}
            onClose={() => setShowNotification(false)}
        />
      </div>
    </>
  );
}

export default CuponReEditView;
