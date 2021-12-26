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
