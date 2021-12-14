/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"

import Header from "./header"
import Footer from "./footer"

const useStyles = makeStyles(theme => ({
	spacer: {
		marginBottom: "4rem",
		[theme.breakpoints.down("md")]: {
			marginBottom: "2rem",
		},
	},
}))

const Layout = ({ children }) => {
	const classes = useStyles()
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
			<div className={classes.spacer} />

			<main>{children}</main>

			<Footer />
		</>
	)
}

export default Layout
