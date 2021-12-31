import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import { ApolloWrapper } from "../../apollo/ApolloWrapper"
import theme from "./theme"

export default function Wrapper({ element }) {
	return (
		<ThemeProvider theme={theme}>
			<ApolloWrapper>{element}</ApolloWrapper>
		</ThemeProvider>
	)
}
