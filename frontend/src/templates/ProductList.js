import React, { useState, useRef, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
//import Pagination from "@material-ui/lab/Pagination"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { graphql } from "gatsby"

import Layout from "../components/ui/layout"
import DynamicToolbar from "../components/product-list/DynamicToolbar"
import ListOfProducts from "../components/product-list/ListOfProducts"

const useStyles = makeStyles(theme => ({
	fab: {
		alignSelf: "flex-end", // to bypass its container's style
		marginRight: "2rem",
		marginBottom: "2rem",
		color: "#fff",
		fontFamily: "Montserrat",
		fontSize: "5rem",
		width: "5rem",
		height: "5rem",
	},
	pagination: {
		alignSelf: "flex-end",
		marginRight: "2%",
		marginTop: "-3rem",
		marginBottom: "4rem",
		[theme.breakpoints.only("md")]: {
			marginTop: "1rem",
		},
	},
	"@global": {
		".MuiPaginationItem-root": {
			fontFamily: "Montserrat",
			fontSize: "2rem",
			color: theme.palette.primary.main,
			"&.Mui-selected": {
				color: "#fff",
			},
		},
	},
}))

export const query = graphql`
	query GetCategorizedProducts($id: String!) {
		# $id is retrieved from the {pageContext}
		allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
			nodes {
				name
				strapiId
				variants {
					id
					color
					price
					size
					style
					images {
						name
						url
					}
				}
			}
		}
	}
`

export default function ProductList({
	// nested destructuring:
	pageContext: { filterOptions, name, description },
	data: {
		// data.allStrapiProduct.nodes ==> data.allStrapiProduct.products
		allStrapiProduct: { nodes: products },
	},
}) {
	const classes = useStyles()

	const [layout, setLayout] = useState("grid")
	const scrollRef = useRef(null)

	const scrollToTop = () => {
		scrollRef.current.scrollIntoView({ behavior: "smooth" })
	}

	return (
		<Layout>
			<Grid container direction="column" alignItems="center">
				<div ref={scrollRef} />
				<DynamicToolbar
					filterOptions={filterOptions}
					name={name}
					description={description}
					layout={layout}
					setLayout={setLayout}
				/>
				<ListOfProducts layout={layout} products={products} />
				<Fab
					onClick={scrollToTop}
					color="primary"
					classes={{ root: classes.fab }}
				>
					⮝
				</Fab>
			</Grid>
		</Layout>
	)
}
