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

	useEffect(() => {
		setPage(1)
	}, [filterOptions, layout])

	const productsPerPage = layout === "list" ? 6 : 15

	// e.g:
	// content = [
	// 	{
	// 		product: "lightbulb - hat",
	// 		variant: [{five}, {different}, {colors}, {of}, {this_variant}]
	// 	},
	//  {every}, {kind}, {of}, {product}, {we}, {have}...
	// ]
	let content = []
	products.map(
		(
			product,
			temp // adding {temp} as a buffer to actually have a field called {product} in the object of {content.push}
		) =>
			product.variants.map(variant =>
				content.push({ product: temp, variant })
			)
	)

	// detailed explanation @5:32--lecture 157
	let isFiltered = false

	// for combining multiple filters e.g:
	// filters = {
	// 	Size: [
	// 		{ checked: true, label: "S" },
	// 		{ checked: true, label: "M" },
	// 	],
	// 	Style: [{ checked: true, label: "Male" }],
	// }
	let filters = {}
	let filteredProducts = []

	// After this we have a list of our ACTIVE filters
	// and we the list of all filtered products but they're NOT YET attached to their corresponding filter
	// meaning that selecting the filters won't render out the desired products YET.
	Object.keys(filterOptions)
		.filter(option => filterOptions[option] !== null)
		.map(option => {
			filterOptions[option].forEach(value => {
				// [option] is {Style} || {Size} || {Color}
				if (value.checked) {
					isFiltered = true
					if (filters[option] === undefined) filters[option] = []
					if (!filters[option].includes(value))
						filters[option].push(value)
					content.forEach(item => {
						if (option === "Color") {
							if (
								// because we want the {colorLabel}, not the hexadecimal format of it, so we have to separate this case from the generalized case below
								item.variant.colorLabel === value.label
							)
								filteredProducts.push(item)
						} else if (
							item.variant[option.toLowerCase()] ===
								value.label &&
							!filteredProducts.includes(item) //e.g. we selected "Male" option, it'll have all the sizes, then we select "S", we don't want to render "S" twice
						)
							filteredProducts.push(item)
					})
				}
			})
		})

	// After this we have a list of ACTIVE filters ATTACHED to their corresponding products.
	Object.keys(filters).forEach(filter => {
		filteredProducts = filteredProducts.filter(item => {
			let valid
			filters[filter].some(value => {
				// e.g. in the list of filteredProducts we have small and medium sizes, and in the {filters}, we also
				// have S, M {value.label}, so what we want is to assign the product to its corresponding {value.label}
				// i.e. small product assigned to {value.label === "S"}, and using <some> is because we want to pair
				// all of the small sizes with the {value.label === "S"}
				// Same logic goes for the following iterations
				if (filter === "Color") {
					if (item.variant.colorLabel === value.label) {
						valid = item // supposed to be {value = item}, but we want the {item} to be accessed from the outer scope, hence the {valid} variable
					}
				} else if (item.variant[filter.toLowerCase()] === value.label) {
					valid = item
				}
			})
			return valid
		})
	})

	if (isFiltered) content = filteredProducts

	const totalPages = Math.ceil(content.length / productsPerPage)

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
				/>
				<ListOfProducts
					page={page}
					filterOptions={filterOptions}
					productsPerPage={productsPerPage}
					layout={layout}
					products={products}
					content={content}
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
