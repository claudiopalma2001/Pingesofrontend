import axios from "axios";
/*esto cambiara en el futuro cuando se despliegue. ver las variables de entorno*/
const USERS_API_LOGIN = "https://pingesobackend-production.up.railway.app/api/v1/usuarios/login"
const USERS_API_SAVE ="https://pingesobackend-production.up.railway.app/api/v1/usuarios/save"
const BASE_URL = "https://pingesobackend-production.up.railway.app/api/v1";

/**
 * Función para iniciar sesión.
 * @param {Object} user - Objeto con las credenciales del usuario.
 * @returns {Promise} Inicio de sesión.
 */
function login(user){
    return axios.post(USERS_API_LOGIN,user);
}

/**
 * Función para registrar un nuevo usuario.
 * @param {Object} user - Objeto con los datos del usuario.
 */
function register(user){
     axios.post(USERS_API_SAVE,user);
}

/**
 * Obtiene información de un usuario mediante su correo.
 * @param {string} email - Correo del usuario.
 * @returns {Promise} una entidad usuario.
 */
function getUserByEmail(email){
    const link = `https://pingesobackend-production.up.railway.app/api/v1/usuarios/correo/${email}`
    return axios.get(link)
}

/**
 * Obtiene los usuarios que tienen un rol específico.
 * @param {number} idRol - Identificador del rol.
 * @returns {Promise} lista de usuarios con un rol específico.
 */
function getUserByIdRol(idRol){
    const link = `https://pingesobackend-production.up.railway.app/api/v1/usuarios/idRol/${idRol}`
    return axios.get(link)
}

/**
 * Obtiene todos los cupones disponibles.
 * @returns {Promise} lista de todos los cupones.
 */
function getCupones() {
    return axios.get(`${BASE_URL}/cupones`);
}

/**
 * Obtiene información de un cupón específico por su ID.
 * @param {number} idCupon - Identificador del cupón.
 * @returns {Promise} una entidad cupon.
 */
function getCuponesById(idCupon) {
    return axios.get(`${BASE_URL}/cupones/${idCupon}`);
}

/**
 * Obtiene cupones por temática.
 * @param {number} idTematica - Identificador de la temática.
 * @returns {Promise} lista de cupones con temática específica.
 */
function getCuponesByIdTematica(idTematica) {
    return axios.get(`${BASE_URL}/cupones/tematica/${idTematica}`);
}

/**
 * Obtiene una plantilla específica por su ID.
 * @param {number} idPlantilla - Identificador de la plantilla.
 * @returns {Promise} una entidad plantilla.
 */
function getPlantillaById(idPlantilla) {
    return axios.get(`${BASE_URL}/plantillas/id/${idPlantilla}`);
}

/**
 * Obtiene plantillas asociadas a un cupón.
 * @param {number} idCupon - Identificador del cupón.
 * @returns {Promise} una entidad plantilla.
 */
function getPlantillasByIdCupon(idCupon) {
    return axios.get(`${BASE_URL}/plantillas/cupon/${idCupon}`);
}

/**
 * Elimina un cupón por su ID.
 * @param {number} idCupon - Identificador del cupón.
 * @returns {Promise} Eliminacion de un cupon.
 */
function deleteCuponById(idCupon){
    return axios.delete(`${BASE_URL}/cupones/${idCupon}`);
}

/**
 * Elimina un cupón final por su ID.
 * @param {number} idCupon - Identificador del cupón final.
 * @returns {Promise} Eliminacion de un cupon final.
 */
function deleteCuponFinalById(idCupon){
    return axios.delete(`${BASE_URL}/cuponfinal/${idCupon}`);
}

/**
 * Guarda un cupón final en la base de datos.
 * @param {Object} cuponFinal - Objeto con los datos del cupón final.
 * @returns {Promise} Nuevo cupon final en la base de datos.
 */
function saveCuponFinalById(cuponFinal){
    return axios.post(`${BASE_URL}/cuponfinal/save`,cuponFinal);
}

/**
 * Obtiene cupones finales asociados a un usuario.
 * @param {number} userId - Identificador del usuario.
 * @returns {Promise} lista de cupones finales asociados a un usuario.
 */
function getCuponesFinalesByUserId(userId) {
    return axios.get(`${BASE_URL}/cuponfinal/idUsuario/${userId}`);
}

/**
 * Guarda una plantilla y un cupón asociado.
 * @param {Object} formData - Objeto con los datos del formulario, incluyendo la imagen.
 *
 */
const savePlantillaAndCupon = async (formData) => {
    try {
        const data = new FormData();

        data.append("archivo", formData.archivo);

        data.append("nombreCupon", formData.nombreCupon);
        data.append("tipo", formData.tipo);
        data.append("idTematica", formData.idTematica);
        data.append("idIdioma", formData.idIdioma);
        data.append("idPlataforma", formData.idPlataforma)
        data.append("precio", formData.precio);

        const response = await axios.post(`${BASE_URL}/plantillas/saveWithCupon`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegurarse de que se envíe como multipart/form-data
            },
        });

        console.log('Plantilla y cupón creados exitosamente', response.data);
        alert('Plantilla y cupón creados exitosamente');
    } catch (error) {
        console.error('Error al crear la plantilla y cupón', error);
        alert('Hubo un error al crear la plantilla y cupón');
    }
};

/**
 * Inicia un proceso de pago.
 * @param {Object} transaccion - Datos de la transacción.
 * @returns {Promise} Un nuevo proceso de pago.
 */
function iniciarPago(transaccion) {
    return axios.post(`${BASE_URL}/pago/webpay`, transaccion);
}

/**
 * Confirma un pago en Webpay.
 * @param {Object} confirmacionRequest - Datos para confirmar la transacción.
 * @returns {Promise} Respuesta de la API.
 */
function confirmarPago(confirmacionRequest) {
    return axios.post(`${BASE_URL}/pago/webpay/commit`, confirmacionRequest);
}

/**
 * Consulta el estado de un pago mediante un token.
 * @param {string} token - Token de la transacción.
 * @returns {Promise} Respuesta de la API.
 */
function consultarEstado(token) {
    return axios.get(`${BASE_URL}/pago/estado/${token}`);
}

/**
 * Obtiene el ID de un usuario a partir de su correo.
 * @param {string} correoId - Correo del usuario.
 * @returns {Promise} Respuesta de la API.
 */
function getIdUsuario(correoId) {
    return axios.get(`${BASE_URL}/usuarios/correoId/${correoId}`);
}

/**
 * Exporta todas las funciones disponibles del servicio.
 */
export default {login, register, getUserByEmail, getUserByIdRol, getCupones, getCuponesByIdTematica, getPlantillasByIdCupon, deleteCuponById, savePlantillaAndCupon, 
    iniciarPago, confirmarPago, consultarEstado, getCuponesFinalesByUserId, getPlantillaById, getCuponesById, deleteCuponFinalById, getIdUsuario
};