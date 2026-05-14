import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import { authAxios } from "@/services/axios-instance";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = useCallback(async () => {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            setCartCount(0);
            return;
        }
        try {
            const response = await authAxios.get("/cart/get-item");
            if (response.data && Array.isArray(response.data)) {
                // Filter out null items if any, similar to CartPage logic
                const validItems = response.data.filter((item) => item !== null);
                setCartCount(validItems.length);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Error fetching cart count:", error);
            // Don't reset to 0 here to avoid flickering if it's just a temporary network error,
            // but if desired, we could. For now, keep as is.
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }

        fetchCartCount();
    }, [fetchCartCount, isAuthenticated]);

    const value = useMemo(() => ({ cartCount, fetchCartCount }), [cartCount, fetchCartCount]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
