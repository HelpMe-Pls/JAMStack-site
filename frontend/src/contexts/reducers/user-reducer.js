import { SET_USER } from "../actions/action-types"

export default function userReducer(state, action) {
	const { user } = action.payload

	let newState = { ...state }

	switch (action.type) {
		case SET_USER:
			if (!user.jwt) {
				// in cases where setUser(defaultUser)
				// to also clear the previous version of logged in/ signed up user
				localStorage.removeItem("user")
			} else {
				// always set the localStorage with the latest version of that user's account
				localStorage.setItem("user", JSON.stringify(user))
			}

			newState = user

			return newState // update context
		default:
			return state
	}
}
