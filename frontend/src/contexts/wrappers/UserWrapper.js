import React, { useEffect, useReducer, createContext, useContext } from "react"
import axios from "axios"
import userReducer from "../reducers/user-reducer"
import { setUser } from "../actions"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

export default function UserWrapper({ children }) {
	const defaultUser = { username: "Guest" }
	const storedUser = JSON.parse(localStorage.getItem("user"))
	const [user, dispatchUser] = useReducer(
		userReducer,
		storedUser || defaultUser
	)

	useEffect(() => {
		if (storedUser) {
			setTimeout(() => {
				axios
					.get(process.env.GATSBY_STRAPI_URL + "/users/me", {
						headers: {
							Authorization: `Bearer ${storedUser.jwt}`,
						},
					})
					.then(response => {
						dispatchUser(
							setUser({
								...response.data,
								jwt: storedUser.jwt,
								onboarding: true,
							})
						)
					})
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
