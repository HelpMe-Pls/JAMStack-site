import React, { useState, useRef, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
import Pagination from "@material-ui/lab/Pagination"
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
		marginRight: "1.69%",
		marginTop: "-2rem",
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
				category {
					name
				}
				variants {
					id
					color
					price
					size
					style
					colorLabel
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
	pageContext: { filterOptions: options, name, description },
	data: {
		// data.allStrapiProduct.nodes ==> data.allStrapiProduct.products
		allStrapiProduct: { nodes: products },
	},
}) {
	const classes = useStyles()

	const [layout, setLayout] = useState("grid")
	const [page, setPage] = useState(1)
	const [filterOptions, setFilterOptions] = useState(options)
	const scrollRef = useRef(null)

	const scrollToTop = () => {
		scrollRef.current.scrollIntoView({ behavior: "smooth" })
	}

	const productsPerPage = layout === "list" ? 6 : 15
	let totalVariants = 0

	products.map(product => (totalVariants += product.variants.length))
	const totalPages = Math.ceil(totalVariants / productsPerPage)

	return (
		<Layout>
			<Grid container direction="column" alignItems="center">
				<div ref={scrollRef} />
				<DynamicToolbar
					filterOptions={filterOptions}
					setFilterOptions={setFilterOptions}
					name={name}
					description={description}
					layout={layout}
					setLayout={setLayout}
					setPage={setPage}
				/>
				<ListOfProducts
					page={page}
					filterOptions={filterOptions}
					productsPerPage={productsPerPage}
					layout={layout}
					products={products}
				/>
				<Pagination
					count={totalPages}
					page={page}
					onChange={(e, newPage) => setPage(newPage)}
					color="primary"
					classes={{ root: classes.pagination }}
				/>
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
