import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "./action-types"

export const addToCart = (variant, qty, name, stock) => ({
	// {stock} is from Apollo, not from the {variant}, so we have to explicitly list it here to be able to access it
	type: ADD_TO_CART,
	payload: { variant, qty, name, stock },
})

export const removeFromCart = (variant, qty) => ({
	// {name} is for the "product" (codeblock, i++, lightbulb), not the "variant", so we don't need to include {name} to this action
	type: REMOVE_FROM_CART,
	payload: { variant, qty },
})

export const clearCart = () => ({
	type: CLEAR_CART,
})
