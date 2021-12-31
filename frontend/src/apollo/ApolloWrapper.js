import React from "react"
import { ApolloProvider } from "@apollo/client"
import { client } from "./client"

// kinda like the React's ContextProvider
export const ApolloWrapper = ({ children }) => {
	return <ApolloProvider client={client}>{children}</ApolloProvider>
}
