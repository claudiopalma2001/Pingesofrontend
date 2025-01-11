import axios from "axios";
/*esto cambiara en el futuro cuando se despliegue. ver las variables de entorno*/
const USERS_API_LOGIN = "http://pingeso12deseostest-env.eba-hdavpsmw.sa-east-1.elasticbeanstalk.com/api/v1/usuarios/login"
const USERS_API_SAVE ="http://pingeso12deseostest-env.eba-hdavpsmw.sa-east-1.elasticbeanstalk.com/api/v1/usuarios/save"
const BASE_URL = "http://pingeso12deseostest-env.eba-hdavpsmw.sa-east-1.elasticbeanstalk.com/api/v1";

function login(user){
    return axios.post(USERS_API_LOGIN,user);
}

function register(user){
     axios.post(USERS_API_SAVE,user);
}
function getUserByEmail(email){
    const link = `http://pingeso12deseostest-env.eba-hdavpsmw.sa-east-1.elasticbeanstalk.com/api/v1/usuarios/correo/${email}`
    return axios.get(link)
}

function getUserByIdRol(idRol){
    const link = `http://pingeso12deseostest-env.eba-hdavpsmw.sa-east-1.elasticbeanstalk.com/api/v1/usuarios/idRol/${idRol}`
    return axios.get(link)
}

function getCupones() {
    return axios.get(`${BASE_URL}/cupones`);
}

function getCuponesById(idCupon) {
    return axios.get(`${BASE_URL}/cupones/${idCupon}`);
}

function getCuponesByIdTematica(idTematica) {
    return axios.get(`${BASE_URL}/cupones/tematica/${idTematica}`);
}

function getPlantillaById(idPlantilla) {
    return axios.get(`${BASE_URL}/plantillas/id/${idPlantilla}`);
}

function getPlantillasByIdCupon(idCupon) {
    return axios.get(`${BASE_URL}/plantillas/cupon/${idCupon}`);
}

function deleteCuponById(idCupon){
    return axios.delete(`${BASE_URL}/cupones/${idCupon}`);
}

function deleteCuponFinalById(idCupon){
    return axios.delete(`${BASE_URL}/cuponfinal/${idCupon}`);
}

function saveCuponFinalById(cuponFinal){
    return axios.post(`${BASE_URL}/cuponfinal/save`,cuponFinal);
}

function getCuponesFinalesByUserId(userId) {
    return axios.get(`${BASE_URL}/cuponfinal/idUsuario/${userId}`);
}

// Función para crear una plantilla y un cupón
const savePlantillaAndCupon = async (formData) => {
    try {
        // Usar FormData para enviar la imagen y los datos en un solo request
        const data = new FormData();
        
        // Añadir el archivo de imagen al FormData
        data.append("archivo", formData.archivo);
        
        // Añadir los demás datos (nombreCupon, tipo, idTematica, idIdioma, idPlataforma) al FormData
        data.append("nombreCupon", formData.nombreCupon);
        data.append("tipo", formData.tipo);
        data.append("idTematica", formData.idTematica);
        data.append("idIdioma", formData.idIdioma);
        data.append("idPlataforma", formData.idPlataforma)
        data.append("precio", formData.precio);
        
        // Enviar la solicitud POST con el FormData
        const response = await axios.post(`${BASE_URL}/plantillas/saveWithCupon`, data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Asegurarse de que se envíe como multipart/form-data
            },
        });

        // Manejar la respuesta exitosa
        console.log('Plantilla y cupón creados exitosamente', response.data);
        alert('Plantilla y cupón creados exitosamente');
    } catch (error) {
        // Manejo de errores
        console.error('Error al crear la plantilla y cupón', error);
        alert('Hubo un error al crear la plantilla y cupón');
    }
};


function iniciarPago(transaccion) {
    return axios.post(`${BASE_URL}/pago/webpay`, transaccion);
}

function confirmarPago(confirmacionRequest) {
    return axios.post(`${BASE_URL}/pago/webpay/commit`, confirmacionRequest);
}

function consultarEstado(token) {
    return axios.get(`${BASE_URL}/pago/estado/${token}`);
}

function getIdUsuario(correoId) {
    return axios.get(`${BASE_URL}/usuarios/correoId/${correoId}`);
}

export default {login, register, getUserByEmail, getUserByIdRol, getCupones, getCuponesByIdTematica, getPlantillasByIdCupon, deleteCuponById, savePlantillaAndCupon, 
    iniciarPago, confirmarPago, consultarEstado, getCuponesFinalesByUserId, getPlantillaById, getCuponesById, deleteCuponFinalById, getIdUsuario
};