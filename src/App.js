import logo from './logo.svg';
import './App.css';
import LoginPage from './views/LoginPage';
import CuponesPage from './views/CuponesPage';
import HomePage from './views/HomePage';
import RegisterPage from './views/RegisterPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserProfile from './components/UserProfile/UserProfile';
import AdminProfile from './components/AdminProfile/AdminProfile';
import CuponEditView from "./views/CuponEditView";
import FormularioCrearPlantillaYCupon from './components/AdminProfile/FormularioPlantillaYCupon';
import ConfirmarPago from './views/ConfirmarPago';
import CartPage from "./views/CartPage";
import HistorialCompras from './views/HistorialCompra';
import CuponReEditView from './views/CuponReEditView';

function App() {
  return (
    
      <div className="App">
        
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cupones/tematica/:idTematica" element={<CuponesPage />} />
                {/*TODO: VER LA LANDING PAGE PAR AUN USER INVITADO, cuando no esta logged*/}
                <Route path='/logout' element ={<HomePage/>}></Route>
                <Route path='/user/:correo' element={<UserProfile/>}></Route>
                <Route path='/admin/:correo' element={<AdminProfile/>}></Route>
                <Route path='/admin/cupon/agregar' element={<FormularioCrearPlantillaYCupon/>}></Route>
                <Route path='/edit/:nombreTematica/:id' element={<CuponEditView/>}></Route>
                <Route path='/reedit/:id' element={<CuponReEditView/>}></Route>
                <Route path='/pago' element={<Pago/>}></Route>
                <Route path='/pago/confirmar' element={<ConfirmarPago/>}></Route>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/historial" element={<HistorialCompras />} />

            </Routes>
        </BrowserRouter>
      </div>
  );
}



export default App;
