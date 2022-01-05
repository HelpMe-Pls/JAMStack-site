import { SET_SNACKBAR } from "../actions/action-types"

export default function feedbackReducer(state, action) {
	const { status, message, open } = action.payload

	switch (action.type) {
		case SET_SNACKBAR:
			if (open === false) return { ...state, open } // default state

			return {
				// snackbars are independent from each other so there's no need to {...state},
				// therefore, this object is considered a new piece of state, not inherit from its previous states
				open: true, // if we don't explicitly set the state {open} === false, it'll automatically set to true
				backgroundColor: status === "error" ? "#FF3232" : "#4BB543",
				message,
			}
		default:
			return state
	}
}
