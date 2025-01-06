import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Archivo de estilos globales
import App from './App'; // Componente principal de tu aplicación
import reportWebVitals from './reportWebVitals'; // Herramientas opcionales para medir rendimiento
import { CartProvider } from './context/CartContext'; // Importa el contexto del carrito

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <CartProvider>
            <App />
        </CartProvider>
    </React.StrictMode>
);

// Medir rendimiento opcional
reportWebVitals();
