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
		// & > *: apply these styles for every child in this container
		"& > *": {
			// 25rem is the frame's width from <ProductFrameGrid>
			// 25rem * 4: get the space that 4 products take up (no space in between them)
			// 100% - (25rem * 4): to get the space remained after rendering out 4 products
			// Ans/3: we want the space in between the 4 products to be evenly divided by 3
			marginRight: ({ layout }) =>
				layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
			marginBottom: "5rem",
		},
		// & > :nth-child(4n): apply this style for EVERY 4th child (4n === 4ths) in this container
		"& > :nth-child(4n)": {
			marginRight: 0, // so that the last child will not be pushed down to the next row
		},

		// [theme.breakpoints.only("xl")]: {
		// 	"& > *": { // apply these styles for every child in this container
		// // 25rem is the frame's width from <ProductFrameGrid>
		// // 25rem * 4: we want 4 products per row
		// // 100% - (25rem * 4): to get the space remained after rendering out 4 products
		// // Ans/3: we want the space in between the 4 products to be evenly divided by 3
		// 		marginRight: ({ layout }) =>
		// 			layout === "grid" ? "calc((100% - (25rem * 4)) / 3)" : 0,
		// 		marginBottom: "5rem",
		// 	},
		// 	"& > :nth-child(4n)": {
		// 		marginRight: 0,
		// 	},
		// },
		// [theme.breakpoints.only("lg")]: {
		// 	"& > *": {
		// 		marginRight: ({ layout }) =>
		// 			layout === "grid" ? "calc((100% - (25rem * 3)) / 2)" : 0,
		// 		marginBottom: "5rem",
		// 	},
		// 	"& > :nth-child(3n)": {
		// 		marginRight: 0,
		// 	},
		// },
		// [theme.breakpoints.only("md")]: {
		// 	"& > *": {
		// 		marginRight: ({ layout }) =>
		// 			layout === "grid" ? "calc(100% - (25rem * 2))" : 0,
		// 		marginBottom: "5rem",
		// 	},
		// 	"& > :nth-child(2n)": {
		// 		marginRight: 0,
		// 	},
		// },
		// [theme.breakpoints.down("sm")]: {
		// 	"& > *": {
		// 		marginBottom: "5rem",
		// 	},
		// },
	},
}))

export default function ListOfProducts({ products, layout }) {
	const classes = useStyles({ layout })

	const FrameHelper = ({ Frame, product, variant }) => {
		const [selectedSize, setSelectedSize] = useState(null)
		const [selectedColor, setSelectedColor] = useState(null)

		let colors = []
		let sizes = []
		product.variants.forEach(variant => {
			sizes.push(variant.size)
			colors.push(variant.color)
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

	return (
		<Grid item container classes={{ root: classes.productContainer }}>
			{products.map(product =>
				product.variants.map(variant => (
					<FrameHelper
						Frame={
							layout === "grid"
								? ProductFrameGrid
								: ProductFrameList
						}
						key={variant.id}
						product={product}
						variant={variant}
					/>
				))
			)}
		</Grid>
	)
}
