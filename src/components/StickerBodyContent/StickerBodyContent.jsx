import { useState } from "react";
import "../../components/SideBar2/styles.css";
import "../../components/StickerBodyContent/StickerBodyContent.css"

function StickerBodyContent({ onStickerSelect }) {
  // Función para importar todas las imágenes desde la carpeta
  const importAll = (requireContext) => requireContext.keys().map(requireContext);

  // Carga las imágenes desde la carpeta de stickers
  const images = importAll(require.context("../../assets/stickers", false, /\.(png)$/));

  // Mapea las imágenes a un formato para las opciones
  const stickers = images.slice(0, 9).map((image) => {
    const fileName = image.split('/').pop().split('.')[0];  // Nombre de archivo sin extensión
    return {
      value: image,
      label: `Sticker ${fileName}`,
      image: image,
    };
  });

  // Estado para manejar la selección de un sticker y mostrar el menú
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker);
    onStickerSelect(sticker);
    setIsMenuOpen(false); // Cierra el menú después de seleccionar un sticker
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ position: "relative", gridArea:"stickers"}}>
      {/* Botón para abrir el menú */}
      <button onClick={toggleMenu} className="open-sticker-menu-btn">
        Seleccionar Sticker
      </button>

      {/* Menú con los stickers */}
      {isMenuOpen && (
        <div className="sticker-menu" style={{ position: "absolute", zIndex: 9999, bottom: "50px", left: 0 }}>
          <div className="sticker-grid">
            {stickers.map((sticker) => (
              <div
                key={sticker.value}
                className="sticker-item"
                onClick={() => handleStickerClick(sticker)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <img
                  src={sticker.image}
                  style={{ width: "60px", height: "60px", borderRadius: "5px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StickerBodyContent;
