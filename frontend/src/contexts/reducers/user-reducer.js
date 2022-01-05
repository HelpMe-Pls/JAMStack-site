import { SET_USER } from "../actions/action-types"

export default function userReducer(state, action) {
	const { user } = action.payload

	let newState = { ...state }

	switch (action.type) {
		case SET_USER:
			if (user.username === "Guest") {
				// to clear the previous version of logged in/ signed up user
				localStorage.removeItem("user")
			} else {
				// always set the localStorage with the latest version of that user's account
				localStorage.setItem("user", JSON.stringify(user))
			}

			newState = user

			return newState
		default:
			return state
	}
}
