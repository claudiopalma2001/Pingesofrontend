import React, { createContext, useState, useEffect } from "react";

// Crea el contexto
export const CartContext = createContext();

// Función para abrir la base de datos de IndexedDB
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('cartItems', 1);

        request.onsuccess = (event) => {
            resolve(event.target.result); // Devuelve la base de datos
        };

        request.onerror = (event) => {
            reject(new Error('Error al abrir la base de datos.'));
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('cupones')) {
                db.createObjectStore('cupones', { keyPath: 'id' }); // Creamos el almacén con clave primaria 'id'
            }
        };
    });
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Cargar los elementos del carrito desde IndexedDB cuando el componente se monte
        const loadCartItems = async () => {
            try {
                const db = await openDB();
                const transaction = db.transaction('cupones', 'readonly');
                const store = transaction.objectStore('cupones');
                const request = store.getAll(); // Obtener todos los elementos

                request.onsuccess = () => {
                    setCartItems(request.result); // Actualiza el estado con los cupones obtenidos
                };

                request.onerror = (error) => {
                    console.error("Error al cargar los elementos del carrito:", error);
                };
            } catch (error) {
                console.error("Error al abrir la base de datos:", error);
            }
        };

        loadCartItems();
    }, []);

    // Función para añadir al carrito en IndexedDB
    const addToCart = async (item) => {
        try {
            const db = await openDB();
            const transaction = db.transaction('cupones', 'readwrite'); // Abrir transacción de lectura y escritura
            const store = transaction.objectStore('cupones');
            store.add(item); // Añadir el item al almacén

            // Esperamos que la transacción termine
            transaction.oncomplete = () => {
                setCartItems((prevItems) => [...prevItems, item]); // Actualiza el estado local
            };

           
        } catch (error) {
            console.error("Error al abrir la base de datos:", error);
        }
    };

    // Función para eliminar del carrito en IndexedDB
    const removeFromCart = async (id) => {
        try {
            const db = await openDB();
            const transaction = db.transaction('cupones', 'readwrite');
            const store = transaction.objectStore('cupones');
            store.delete(id); // Eliminar el item por id

            // Esperamos que la transacción termine
            transaction.oncomplete = () => {
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Actualiza el estado local
            };

            transaction.onerror = (error) => {
                console.error("Error al eliminar del carrito:", error);
            };
        } catch (error) {
            console.error("Error al abrir la base de datos:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};