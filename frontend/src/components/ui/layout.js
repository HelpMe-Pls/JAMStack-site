/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"

const Layout = ({ children }) => {
	const data = useStaticQuery(graphql`
		query GetCategories {
			allStrapiCategory {
				nodes {
					name
					strapiId
				}
			}
		}
	`)

	return (
		<>
			<Header categories={data.allStrapiCategory.nodes} />
			<div style={{ marginBottom: "20rem" }} />

			<main>{children}</main>

			<Footer />
		</>
	)
}

export default Layout
