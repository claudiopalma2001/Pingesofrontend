import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar.jsx';
import '../Navbar/Navbar.css';
import "../AdminProfile/AdminProfile.css";
import gestionService from "../../services/gestion-service";
import SideBar from "../SideBar/SideBar";

/**
 * Vista de la pagina del perfil del usuario Administrador.
 * Permite a los administradores gestionar cupones, incluyendo su visualización, eliminación, y filtrado por categoría.
 *
 * @returns {JSX.Element} Página de perfil de administrador.
 */
function AdminProfile() {
  /**
   * Estado para almacenar todos los cupones disponibles.
   * @type {Array} cupones - Lista de cupones.
   */
  const [cupones, setCupones] = useState([]);

  /**
   * Estado para almacenar las plantillas asociadas a los cupones.
   * @type {Object} plantillas - Plantillas organizadas por ID de cupón.
   */
  const [plantillas, setPlantillas] = useState({});

  /**
   * Llama al servicio para obtener todos los cupones y sus plantillas.
   * Se ejecuta cuando el componente se monta.
   */
  useEffect(() => {
    gestionService.getCupones()
        .then(response => {
          setCupones(response.data);
          response.data.forEach(cupon => {
            gestionService.getPlantillasByIdCupon(cupon.id)
                .then(res => {
                  setPlantillas(prevState => ({
                    ...prevState,
                    [cupon.id]: res.data
                  }));
                })
                .catch(error => {
                  console.error(`Error fetching templates for coupon ${cupon.id}:`, error);
                });
          });
        })
        .catch(error => {
          console.error("Error fetching cupones:", error);
        });
  }, []);

  /**
   * Estado para la categoría seleccionada para filtrar los cupones.
   * @type {string} selectedCategory - Categoría seleccionada (por defecto "Todas").
   */
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Hook para manejar la navegación.
  const navigate = useNavigate();

  /**
   * Filtra los cupones según la categoría seleccionada.
   * Si la categoría es "Todas", se muestran todos los cupones.
   */
  const filteredCoupons = selectedCategory === "Todas" ? cupones : cupones.filter(coupon => coupon.idTematica === parseInt(selectedCategory));

  /**
   * Estado para el cupón seleccionado.
   * @type {Object|null} cuponSeleccionado - Cupón actual seleccionado.
   */
  const [cuponSeleccionado, setCuponSeleccionado] = useState(null); // Cupón actual para edición

  /**
   * Elimina un cupón de la lista y del backend.
   *
   * @param {number} idCupon - ID del cupón a eliminar.
   */
  const handleDeleteCupon = async (idCupon) => {
    try {
      await gestionService.deleteCuponById(idCupon);
      setCupones((prevCupones) => prevCupones.filter((cupon) => cupon.id !== idCupon));
      if (cuponSeleccionado && cuponSeleccionado.id === idCupon) {
       setCuponSeleccionado(null);
      }
      alert("Cupón eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el cupón", error);
      alert("No se pudo eliminar el cupón");
    }
  };

  // Controla si las imágenes se han cargado.
  const [loaded, setLoaded] = useState(false);

  /**
   * Estado para controlar la visibilidad de la sidebar.
   * @type {[boolean, function]} isSidebarVisible - Determina si la sidebar está visible.
   * @type {function} setSidebarVisible - Actualiza el estado de visibilidad de la sidebar.
   */
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  /**
   * Alterna la visibilidad de la sidebar.
   * Si está visible, la oculta; si no, la muestra.
   */
  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  /**
   * Cierra la sidebar estableciendo su visibilidad como `false`.
   */
  const closeSidebar = () => {
    setSidebarVisible(false);
  }

  /**
   * Estructura la página del perfil del administrador.
   */
  return (
    <div className="admin-profile-container">
      <Navbar toggleSidebar={toggleSidebar}/>
      <SideBar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
      <div className="admin-profile-body">
        <div className="admin-profile-header">
          <h2>Administrar cupones</h2>
        </div>
        <div className="add-cupon-container">
          <button className="add-cupon-button" onClick={() => navigate('/admin/cupon/agregar')} type="button"> + Añadir cupones</button>
        </div>
        <div className="category-selector">
          <label htmlFor="category">Seleccionar categoría:</label>
          <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="1">Pololos</option>
            <option value="2">Familiar</option>
            <option value="3">Infantil</option>
            <option value="4">Amistad</option>
            <option value="5">Papá</option>
            <option value="6">Embarazada</option>
            <option value="7">Personalizable</option>
            <option value="8">Extra</option>
          </select>
        </div>
        <div className="cupones-list-container">
          <div className="cupones-list">
            {filteredCoupons.map((cupon) => (
                <div key={cupon.id} className="cupon-card">
                  {plantillas[cupon.id] && plantillas[cupon.id].map((plantilla) => (
                      <img
                          src={require(`../../assets/Plantillas/Todas/${plantilla.urlImagen}`)}
                          alt={`Plantilla ${plantilla.urlImagen}`}
                          className={`plantilla-image ${loaded ? "loaded" : ""}`}
                          onLoad={() => setLoaded(true)}
                      />
                  ))}
                  <h3 className="cupons-body-content-text">{cupon.nombreCupon}</h3>
                  <button className="eliminar-button" onClick={() => handleDeleteCupon(cupon.id)}>Eliminar</button>
                </div>
            ))}
            <div style={{height: "80px"}}></div>
            <div style={{height: "80px"}}></div>
            <div style={{height: "80px"}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;