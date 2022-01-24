import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { useQuery } from "@apollo/client"

import { GET_DETAILS } from "../../apollo/queries"

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
	content,
	layout,
	page,
	productsPerPage,
}) {
	const classes = useStyles({ layout })
	const matchesSM = useMediaQuery(theme => theme.breakpoints.down("sm"))

	const FrameHelper = ({ Frame, product, variant }) => {
		const [selectedSize, setSelectedSize] = useState(null)
		const [selectedColor, setSelectedColor] = useState(null)
		const [selectedVariant, setSelectedVariant] = useState(null)
		const [stock, setStock] = useState(null)
		const [rating, setRating] = useState(0)

		const hasStyles = product.variants.some(item => item.style !== null)

		let colors = []
		let sizes = []
		product.variants.forEach(item => {
			sizes.push(item.size)

			// fix duplicate color swatches in "shirt" category
			if (
				!colors.includes(item.color) &&
				item.size === (selectedSize || variant.size) &&
				item.style === variant.style
			)
				colors.push(item.color)
		})

		// Setting the display image as the first color (colors[0]) in the swatches
		// when the user switches the size
		useEffect(() => {
			if (selectedSize === null) return undefined // a checkpoint to prevent breaking the render of Hats (coz they only have the Color property)
			setSelectedColor(null)

			const newVariant = product.variants.find(
				item =>
					item.size === selectedSize &&
					item.style === variant.style &&
					item.color === colors[0]
			)

			setSelectedVariant(newVariant)
		}, [selectedSize])

		const { error, data } = useQuery(GET_DETAILS, {
			variables: { id: product.strapiId },
		})

		useEffect(() => {
			if (error) {
				setStock(-1)
			} else if (data) {
				setStock(data.product.variants) // stock is applied to the product, not the variant, so if we want to get the "stock" of a singular variant, it'll be data.product.variants[variant].qty
				setRating(data.product.rating)
			}
		}, [error, data])

		return (
			<Frame
				product={product}
				variant={selectedVariant || variant} // {variant} is for initial render, {selectedVariant} for subsequential renders
				rating={rating}
				sizes={sizes}
				selectedSize={selectedSize || variant.size}
				setSelectedSize={setSelectedSize}
				colors={colors}
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
				hasStyles={hasStyles}
				stock={stock}
			></Frame>
		)
	}

	return (
		<Grid
			item
			container
			direction={matchesSM ? "column" : "row"}
			alignItems={matchesSM ? "center" : undefined}
			classes={{ root: classes.productContainer }}
		>
			{content
				// get the number of products to display on a page
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
