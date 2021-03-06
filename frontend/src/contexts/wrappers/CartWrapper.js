import React, { useReducer, createContext, useContext } from "react"
import cartReducer from "../reducers/cart-reducer"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartWrapper({ children }) {
	const storedCart =
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("cart"))
			: null
	const [cart, dispatchCart] = useReducer(cartReducer, storedCart || []) // []: empty cart

	return (
		<CartContext.Provider value={{ cart, dispatchCart }}>
			{children}
		</CartContext.Provider>
	)
}
