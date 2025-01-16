import React from 'react';
import './SideBar.css';
import { useNavigate } from "react-router-dom";

/**
 * Componente de barra lateral (SideBar).
 * Permite navegar entre diferentes temáticas de cupones y se puede mostrar u ocultar dinámicamente.
 *
 * @param {boolean} isVisible - Determina si la barra lateral es visible.
 * @param {function} closeSidebar - Función para cerrar la barra lateral.
 * @returns {JSX.Element} Componente SideBar.
 */
function SideBar({ isVisible, closeSidebar }) {
    // Hook para manejar la navegación en la aplicación.
    const navigate = useNavigate();

    /**
     * Array de referencias para las rutas de los botones.
     * Cada objeto incluye una etiqueta (`label`) y una ruta (`path`).
     */
    const referencias = [
        { label: "Pololos", path: "/cupones/tematica/1" },
        { label: "Familiar", path: "/cupones/tematica/2" },
        { label: "Infantil", path: "/cupones/tematica/3" },
        { label: "Amistad", path: "/cupones/tematica/4" },
        { label: "Papá", path: "/cupones/tematica/5" },
        { label: "Embarazada", path: "/cupones/tematica/6" },
        { label: "Personalizable", path: "/cupones/tematica/7" },
        { label: "Extra", path: "/cupones/tematica/8" }
    ];

    /**
     * Maneja la navegación al presionar un botón.
     * Navega a la ruta especificada y cierra la barra lateral.
     *
     * @param {string} path - Ruta a la que se navega.
     */
    const handleNavigate = (path) => {
        navigate(path);
        closeSidebar();
    };

    /**
     * Estructura de la barra lateral.
     * Incluye botones que permiten navegar a diferentes temáticas.
     */
    return (
        <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
            <div style={{height: "40px"}}></div>
            <div className="form-group">
                {referencias.map((ref, index) => (
                    <div key={index}>
                        <button
                            type="button"
                            onClick={() => handleNavigate(ref.path)}
                        >
                            {ref.label}
                        </button>
                    </div>
                ))}
            </div>
            <div style={{height: "80px"}}></div>
        </div>
    );
}

export default SideBar;
