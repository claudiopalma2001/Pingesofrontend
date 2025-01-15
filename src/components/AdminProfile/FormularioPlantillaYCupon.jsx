import React, { useState } from 'react';
import gestionService from "../../services/gestion-service";
import { Link } from "react-router-dom";
import "./FormularioPlanitllaYCupon.css"


const FormularioCrearPlantillaYCupon = () => {
    const [formData, setFormData] = useState({
        archivo: null,
        nombreCupon: '',
        idTematica: '',
        precio: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'archivo') {
            setFormData({ ...formData, archivo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await gestionService.savePlantillaAndCupon(formData);
    };

    return (
        <div className="main-page-admin-content">
            <div className="form-admin-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group-admin">
                        <label>Imagen de Plantilla</label>
                        <input type="file" name="archivo" onChange={handleChange}/>
                    </div>

                    <div className="form-group-admin">
                        <label>Nombre del Cupón</label>
                        <input type="text" name="nombreCupon" onChange={handleChange}/>
                    </div>

                    <div className="form-group-admin">
                        <label>Temática del cupón</label>
                        <select name="idTematica" onChange={handleChange} value={formData.idTematica}>
                            <option value="">Selecciona una temática</option>
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

                    <div className="form-group-admin">
                        <label>Precio</label>
                        <input type="number" name="precio" onChange={handleChange}/>
                    </div>
                    <div style={{height: "30px"}}></div>
                    <button className="add-cupon-button-admin" type="submit">Crear Plantilla y Cupón</button>

                    <div>
                        <Link to="/">
                            <button className="cancel-cupon-button" type="button">Cancelar</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioCrearPlantillaYCupon;
