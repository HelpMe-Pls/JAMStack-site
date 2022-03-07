import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import { useIsClient } from "../../hooks"
import ProductFrameGrid from "../product-list/ProductFrameGrid"

const useStyles = makeStyles(theme => ({
	recentContainer: {
		margin: "10rem 0",
		"& > :not(:last-child)": {
			marginRight: "2rem",
		},
	},
	arrow: {
		minWidth: 0,
		height: "4rem",
		width: "4rem",
		fontSize: "4rem",
		color: theme.palette.primary.main,
		borderRadius: 50,
		[theme.breakpoints.down("xs")]: {
			height: "1rem",
			width: "1rem",
		},
	},
}))

export default function RecentlyViewed({ products }) {
	const classes = useStyles()
	const [firstIndex, setFirstIndex] = useState(0)
	const { isClient, key } = useIsClient()

	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const displayNum = matchesXS
		? 1
		: matchesMD
		? products?.length > 2
			? 2
			: products?.length
		: products?.length > 4
		? 4
		: products?.length

	const handleNavigation = direction => {
		// bounding the navigation within the list
		if (firstIndex === 0 && direction === "backward") return null
		if (
			// end of the list
			firstIndex + displayNum === products.length &&
			direction === "forward"
		)
			return null
		setFirstIndex(direction === "forward" ? firstIndex + 1 : firstIndex - 1)
	}

	return (
		<Grid
			item
			key={key}
			container
			justifyContent="center"
			alignItems="center"
			classes={{ root: classes.recentContainer }}
		>
			<Grid item>
				<Button
					onClick={() => handleNavigation("backward")}
					classes={{ root: classes.arrow }}
				>
					⮜
				</Button>
			</Grid>
			{
				products && isClient
					? products
							.slice(firstIndex, firstIndex + displayNum)
							.map(product => {
								const hasStyles = product.variants.some(
									variant => variant.style !== null
								)

								return (
									<ProductFrameGrid
										key={
											product.variants[
												product.selectedVariant
											].id
										}
										product={product}
										variant={
											product.variants[
												product.selectedVariant
											]
										}
										disableQuickView
										// this prop is only applied for this specific instance of the <ProductFrameGrid>,
										small // every other instances stay the same
										hasStyles={hasStyles}
									/>
								)
							})
					: null // in case the localStorage is empty
			}
			<Grid item>
				<Button
					onClick={() => handleNavigation("forward")}
					classes={{ root: classes.arrow }}
				>
					⮞
				</Button>
			</Grid>
		</Grid>
	)
}
