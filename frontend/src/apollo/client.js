import fetch from "cross-fetch"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

export const client = new ApolloClient({
	link: new HttpLink({
		uri: process.env.GATSBY_STRAPI_URL + "/graphql",
		fetch,
	}),
	cache: new InMemoryCache(), // so that it won't fire a new request if the user makes the same query
})
