import React, { useState } from 'react';
import gestionService from "../../services/gestion-service";
import { Link } from "react-router-dom";
import "./FormularioPlanitllaYCupon.css"

/**
 * Vista de la pagina del Formulario para crear plantilla y cupon.
 * Permite a los administradores crear plantillas y cupones mediante un formulario.
 *
 * @returns {JSX.Element} Formulario de creación de plantillas y cupones.
 */
const FormularioCrearPlantillaYCupon = () => {
    const [formData, setFormData] = useState({
        archivo: null,
        nombreCupon: '',
        tipo: 'free',
        idTematica: '',
        idIdioma: '1', // Por defecto, Español
        idPlataforma: '1', // Por defecto, Escritorio
        precio: '',
    });

    /**
     * Maneja los cambios en los campos del formulario.
     * Actualiza el estado de `formData` según el campo modificado.
     *
     * @param {Event} e - Evento del input.
     */
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'archivo') {
            setFormData({ ...formData, archivo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    /**
     * Maneja el envío del formulario.
     * Envía los datos al servicio para guardar la plantilla y el cupón.
     *
     * @param {Event} e - Evento del envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        await gestionService.savePlantillaAndCupon(formData);
    };

    /**
     * Estructura del formulario de creación.
     * Incluye campos para la imagen, datos del cupón, idioma, plataforma, y precio.
     */
    return (
        <div className="main-page-admin-content">
            <div className="form-admin-content">
                <h1 className="form-title">Crear Plantilla y Cupón</h1>
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
                        <label>Tipo de cupón</label>
                        <select name="tipo" onChange={handleChange} value={formData.tipo}>
                            <option value="">Selecciona un tipo</option>
                            <option value="free">Gratis</option>
                        </select>
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
                        <label>Idioma</label>
                        <select name="idIdioma" onChange={handleChange} value={formData.idIdioma}>
                            <option value="1">Español</option>
                        </select>
                    </div>

                    <div className="form-group-admin">
                        <label>Plataforma</label>
                        <select name="idPlataforma" onChange={handleChange} value={formData.idPlataforma}>
                            <option value="1">Escritorio</option>
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
