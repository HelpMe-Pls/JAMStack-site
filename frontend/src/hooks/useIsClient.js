import { useState, useEffect } from "react"

// To fix rehydration issues:
// e.g. the server built the page with EMPTY cart, then it serves the page to the client, then the client adds some items to the cart (which will then be saved into client's localStorage), THEN THE USER REFRESHES the page, it'll load the page from the server again (which has EMPTY cart) so that creates a conflict with the client's localStorage, which causes React to explode and breaks the layout.
// So that's where this hook comes into play: it has the useEffect() inside of it to make sure the server uses the client-side info once the components are MOUNTED (so that when the user refreshes, the page will rerender with the client-side info i.e. the "cart" from localStorage)

export const useIsClient = () => {
	const [isClient, setIsClient] = useState(false)

	// to trigger rehydration/rerender with client-side info (e.g. localStorage) once the component is MOUNTED
	const key = isClient ? "client" : "server"

	useEffect(() => {
		setIsClient(true)
	}, [])

	return { isClient, key }
}
