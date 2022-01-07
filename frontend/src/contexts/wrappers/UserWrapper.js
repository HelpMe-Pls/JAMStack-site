import React, { useEffect, useReducer, createContext, useContext } from "react"
import axios from "axios"
import userReducer from "../reducers/user-reducer"
import { setUser } from "../actions"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

export function UserWrapper({ children }) {
	const defaultUser = {}
	const storedUser = JSON.parse(localStorage.getItem("user")) //JSON.parse to get the user "object"
	const [user, dispatchUser] = useReducer(
		userReducer,
		storedUser || defaultUser
	)

	useEffect(() => {
		if (storedUser) {
			// checking if the current authenticated user is having the latest version of their account
			// e.g. the user makes changes to their account on another device,
			// we want to reflect those changes in the next time they login
			// Or: the user got blocked while they're logged in, the next time they refresh the page,
			// the localStorage cleared their creds, and they're logged out automatically after 3s
			setTimeout(() => {
				axios
					.get(process.env.GATSBY_STRAPI_URL + "/users/me", {
						// "/users/me" is the current authenticated user
						headers: {
							Authorization: `Bearer ${storedUser.jwt}`,
						},
					})
					.then(response => {
						// console.log(response)
						dispatchUser(
							setUser({
								// this time the {data} only contains {user}, not the {jwt},
								// because the user is still authorized
								...response.data,
								// so we have to add {jwt} for the following GET request to be authorized
								jwt: storedUser.jwt,
								onboarding: true,
							})
						)
					})
					// user's token expired or the user is unauthenticated/blocked
					.catch(error => {
						console.error(error)
						dispatchUser(setUser(defaultUser))
					})
			}, 3000)
		}
	}, [])

	return (
		<UserContext.Provider value={{ user, dispatchUser, defaultUser }}>
			{children}
		</UserContext.Provider>
	)
}
