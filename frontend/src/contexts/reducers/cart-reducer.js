import {
	ADD_TO_CART,
	REMOVE_FROM_CART,
	CLEAR_CART,
} from "../actions/action-types"

export default function cartReducer(state, action) {
	let newCart = [...state]

	let existingIndex

	if (action.payload) {
		existingIndex = state.findIndex(
			item => item.variant === action.payload.variant
		)
	}

	const saveData = cart => {
		localStorage.setItem("cart", JSON.stringify(cart))
	}

	switch (action.type) {
		case ADD_TO_CART:
			if (existingIndex !== -1) {
				let newQty = newCart[existingIndex].qty + action.payload.qty

				if (newQty > action.payload.stock) {
					newQty = action.payload.stock // make sure the user can't add more items than the stock
				}

				newCart[existingIndex] = {
					// update the existing item in the cart with its new qty
					...newCart[existingIndex],
					qty: newQty,
				}
			} else {
				// there's no such variant in the state, so we add it as a new one
				newCart.push(action.payload)
			}

			saveData(newCart) // save to localStorage

			return newCart // save to React's context
		case REMOVE_FROM_CART:
			const newQty = newCart[existingIndex].qty - action.payload.qty

			if (newQty <= 0) {
				// REMOVE (not setting it to 0) that existing item from context
				newCart = newCart.filter(
					item => item.variant !== action.payload.variant
				)
			} else {
				newCart[existingIndex] = {
					...newCart[existingIndex],
					qty: newQty,
				}
			}

			saveData(newCart)

			return newCart
		case CLEAR_CART:
			localStorage.removeItem("cart")

			return [] // clear context
		default:
			return state
	}
}
