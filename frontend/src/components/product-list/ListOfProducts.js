import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
// import { useQuery } from "@apollo/client"

// import { GET_DETAILS } from "../../apollo/queries"

import ProductFrameGrid from "./ProductFrameGrid"
import ProductFrameList from "./ProductFrameList"


const useStyles = makeStyles(theme => ({
	productContainer: {
		width: "95%",
		// ## & > *: apply these styles for every child in this container
		// "& > *": {
		// 	 25rem is the frame's width from <ProductFrameGrid>
		// 	 25rem * 4: get the space that 4 products take up (no space in between them)
		// 	 100% - (25rem * 4): to get the space remained after rendering out 4 products
		// 	 Ans/3: we want the space in between the 4 products to be evenly divided by 3
		// 	marginRight: ({ layout }) =>
		// 		layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
		// 	marginBottom: "5rem",
		// },
		// ## & > :nth-child(4n): apply this style for EVERY 4th child (4n === 4ths) in this container
		// "& > :nth-child(4n)": {
		// 	marginRight: 0, // so that the last child will not be pushed down to the next row
		// },

		[theme.breakpoints.only("xl")]: {
			"& > *": {
				marginRight: ({ layout }) =>
					layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
				marginBottom: "5rem",
			},
			"& > :nth-child(4n)": {
				marginRight: 0,
			},
		},
		[theme.breakpoints.only("lg")]: {
			"& > *": {
				marginRight: ({ layout }) =>
					layout === "grid" ? "calc((100% - (25rem * 3)) / 2)" : 0,
				marginBottom: "5rem",
			},
			"& > :nth-child(3n)": {
				marginRight: 0,
			},
		},
		[theme.breakpoints.only("md")]: {
			"& > *": {
				marginRight: ({ layout }) =>
					layout === "grid" ? "calc(100% - (25rem * 2))" : 0,
				marginBottom: "5rem",
			},
			"& > :nth-child(2n)": {
				marginRight: 0,
			},
		},
		[theme.breakpoints.down("sm")]: {
			"& > *": {
				marginBottom: "5rem",
			},
		},
	},
}))

export default function ListOfProducts({
	products,
	layout,
	page,
	productsPerPage,
	filterOptions,
}) {
	const classes = useStyles({ layout })
	const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

	const FrameHelper = ({ Frame, product, variant }) => {
		const [selectedSize, setSelectedSize] = useState(null)
		const [selectedColor, setSelectedColor] = useState(null)

		let colors = []
		let sizes = []
		product.variants.forEach(variant => {
			sizes.push(variant.size)

			// fix duplicate color swatches in "shirt" category
			if (!colors.includes(variant.color)) colors.push(variant.color)
		})
		return (
			<Frame
				sizes={sizes}
				selectedSize={selectedSize}
				setSelectedSize={setSelectedSize}
				colors={colors}
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
				product={product}
				variant={variant}
			></Frame>
		)
	}

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
								item.variant.colorLabel === value.label &&
								!filteredProducts.includes(item) //TODO: seems irrelevant here, try to omit it then see what happens
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

	return (
		<Grid
			item
			container
			direction={matchesSM ? "column" : "row"}
			alignItems={matchesSM ? "center" : undefined}
			classes={{ root: classes.productContainer }}
		>
			{content
				.slice((page - 1) * productsPerPage, page * productsPerPage)
				.map(item => (
					<FrameHelper
						Frame={
							layout === "grid"
								? ProductFrameGrid
								: ProductFrameList
						}
						key={item.variant.id}
						product={products[item.product]}
						variant={item.variant}
					/>
				))}
		</Grid>
	)
}
