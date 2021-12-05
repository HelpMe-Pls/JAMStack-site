/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"

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
			<div
				style={{
					margin: `0 auto`,
					maxWidth: 960,
					padding: `0 1.0875rem 1.45rem`,
				}}
			>
				<main>{children}</main>
				{/* <footer
					style={{
						marginTop: `2rem`,
					}}
				>
					© {new Date().getFullYear()}, Built with
					{` `}
					<a href="https://www.gatsbyjs.com">Gatsby</a>
				</footer> */}
			</div>
		</>
	)
}

export default Layout
