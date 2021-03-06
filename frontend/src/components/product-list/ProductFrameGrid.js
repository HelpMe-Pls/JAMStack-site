import React, { useState } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { navigate } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import QuickView from "./QuickView"

import frame from "../../images/product-frame-grid.svg"

const useStyles = makeStyles(theme => ({
	frame: {
		backgroundImage: `url(${frame})`,
		backgroundPosition: "center",
		backgroundSize: "contain", // to make sure the borders appear correctly
		backgroundRepeat: "no-repeat",
		height: "25rem",
		width: "25rem",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("xs")]: {
			height: "20rem",
			width: "20rem",
		},
		[theme.breakpoints.up("xs")]: {
			height: ({ small }) => (small ? "12rem" : undefined),
			width: ({ small }) => (small ? "12rem" : undefined),
		},
	},
	product: {
		height: "20rem",
		width: "20rem",
		[theme.breakpoints.down("xs")]: {
			height: "15rem",
			width: "15rem",
		},
		[theme.breakpoints.up("xs")]: {
			height: ({ small }) => (small ? "10rem" : undefined),
			width: ({ small }) => (small ? "10rem" : undefined),
		},
	},
	title: {
		backgroundColor: "#8f9ce7",
		height: "5rem",
		width: "25rem",
		display: "flex", // so that we don't have to wrap extra <Grid container> and <Grid item> around the <img> to have it centered
		justifyContent: "center",
		alignItems: "center",
		marginTop: "-0.1rem",
		[theme.breakpoints.down("xs")]: {
			width: "20rem",
		},
		[theme.breakpoints.up("xs")]: {
			width: ({ small }) => (small ? "12rem" : undefined),
		},
	},
	invisibility: {
		visibility: "hidden",
	},
	frameContainer: {
		"&:hover": {
			cursor: "pointer",
		},
	},
}))

// e.g. get colorIndex of the "red lightbulb - hat" :
// const product = {
// 	"variants": [
// 	{
// 		"color": "#FFF"
// 	},
// 	{
// 		"color": "#2A363B"
// 	},
// 	{
// 		"color": "#99B898"
// 	},
// 	{
// 		"color": "#FECEA8"
// 	},
// 	{
// 		"color": "#E84A5F"
// 	}
// 	]
// };
// product.variants.filter(item => item.color === "#E84A5F") returns the array [{ color: "#E84A5F" }]
// [{ color: "#E84A5F" }][0] returns the object { color: "#E84A5F" }
// product.variants.indexOf({ color: "#E84A5F" }) returns 4
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#description
// Using product.variants.indexOf({ color: "#E84A5F" }) doesn't work because indexOf() implemented strict equality comparison
// Therefore, the reference of { color: "#E84A5F" } could never be found

// if there's no {style}, we could use:
// export const colorIndex = (product, color) => product.variants.findIndex(item => item.color === color)

export const colorIndex = (product, variant, color) => {
	return product.variants.indexOf(
		product.variants.filter(
			item =>
				item.color === color &&
				variant.style === item.style &&
				variant.size === item.size // in case of multiple sizes have the same color
		)[0]
	)
}
export default function ProductFrameGrid({
	product,
	variant,
	rating,
	sizes,
	selectedSize,
	setSelectedSize,
	colors,
	selectedColor,
	setSelectedColor,
	hasStyles,
	small,
	disableQuickView,
	stock,
}) {
	const classes = useStyles({ small })

	const [openDialog, setOpenDialog] = useState(false)

	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
	if (matchesMD && openDialog) {
		setOpenDialog(false)
	}

	const imageIndex = colorIndex(product, variant, selectedColor)

	const imgURL =
		// After uploading the images to AWS s3, they're hosted on Amazon (by the aws-s3 plugin), therefore we'll remove the previously "process.env.GATSBY_STRAPI_URL +" so that Strapi can point to the correct source (AWS S3 bucket) to get the images.
		imageIndex !== -1
			? product.variants[imageIndex].images[0].localFile
			: variant.images[0].localFile

	const img = getImage(imgURL)

	const productName = product.name.split(" ")[0]

	return (
		<Grid
			item
			classes={{
				root: clsx(classes.frameContainer, {
					[classes.invisibility]: openDialog === true,
				}),
			}}
		>
			<Grid
				container
				direction="column"
				onClick={() =>
					matchesMD || disableQuickView
						? navigate(
								`/${product.category.name.toLowerCase()}/${product.name
									.split(" ")[0]
									.toLowerCase()}${
									hasStyles ? `?style=${variant.style}` : ""
								}`
						  )
						: setOpenDialog(true)
				}
			>
				<Grid item classes={{ root: classes.frame }}>
					<GatsbyImage
						image={img}
						alt={product.name}
						className={classes.product}
					/>
				</Grid>
				<Grid item classes={{ root: classes.title }}>
					<Typography variant="h5">{productName}</Typography>
				</Grid>
			</Grid>
			<QuickView
				open={openDialog}
				setOpen={setOpenDialog}
				sizes={sizes}
				selectedSize={selectedSize}
				setSelectedSize={setSelectedSize}
				colors={colors}
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
				img={img}
				imageIndex={imageIndex}
				name={productName}
				variant={variant}
				rating={rating}
				price={variant.price}
				product={product}
				hasStyles={hasStyles}
				stock={stock}
			/>
		</Grid>
	)
}
