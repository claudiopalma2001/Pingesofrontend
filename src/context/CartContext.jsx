import React, { createContext, useState } from "react";

// Crea el contexto
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Intenta cargar datos desde localStorage
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Función para añadir al carrito
    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems, item];
            localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Guarda en localStorage
            return updatedCart;
        });
    };

    // Función para eliminar del carrito
    const removeFromCart = (id) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter((item) => item.id !== id);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Actualiza localStorage
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
