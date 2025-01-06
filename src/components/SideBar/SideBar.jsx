import React from 'react';
import './SideBar.css';
import { useNavigate } from "react-router-dom";

function SideBar({ isVisible, closeSidebar }) {
    const navigate = useNavigate();

    // Array de referencias para las rutas de los botones
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

    // Función para manejar la navegación y cerrar la sidebar
    const handleNavigate = (path) => {
        navigate(path); // Navega a la ruta
        closeSidebar(); // Cierra la sidebar
    };

    return (
        <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
            <div style={{ height: "40px" }}></div>
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
        </div>
    );
}

export default SideBar;
