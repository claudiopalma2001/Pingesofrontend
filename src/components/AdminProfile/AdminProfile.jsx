import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar.jsx';
import '../Navbar/Navbar.css';
import "../AdminProfile/AdminProfile.css";
import gestionService from "../../services/gestion-service";
import SideBar from "../SideBar/SideBar";

function AdminProfile() {

  const [cupones, setCupones] = useState([]);
  const [plantillas, setPlantillas] = useState({});


  useEffect(() => {
    // Llama al servicio para obtener todos los cupones
    gestionService.getCupones()
        .then(response => {
          setCupones(response.data); // Guarda todos los cupones en el estado
          response.data.forEach(cupon => {
            // Llama al servicio para obtener las plantillas de cada cupón
            gestionService.getPlantillasByIdCupon(cupon.id)
                .then(res => {
                  setPlantillas(prevState => ({
                    ...prevState,
                    [cupon.id]: res.data // Guarda las plantillas para cada ID de cupón
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

  
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  

  const navigate = useNavigate();

  const filteredCoupons = selectedCategory === "Todas" ? cupones : cupones.filter(coupon => coupon.idTematica === parseInt(selectedCategory));

  const [cuponSeleccionado, setCuponSeleccionado] = useState(null); // Cupón actual para edición

  // Función para eliminar un cupón
  const handleDeleteCupon = async (idCupon) => {
    try {
      await gestionService.deleteCuponById(idCupon);
      setCupones((prevCupones) => prevCupones.filter((cupon) => cupon.id !== idCupon));
      // Restablece los estados relacionados con el cupón eliminado
      if (cuponSeleccionado && cuponSeleccionado.id === idCupon) {
       setCuponSeleccionado(null); // Limpia el cupón seleccionado si es el eliminado
      }
      alert("Cupón eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el cupón", error);
      alert("No se pudo eliminar el cupón");
    }
  };

  const [loaded, setLoaded] = useState(false);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setSidebarVisible(false);
  }

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