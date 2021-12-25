import React, { useState } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { navigate } from "gatsby"

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
		// [theme.breakpoints.down("xs")]: {
		// 	height: "20rem",
		// 	width: "20rem",
		// },
		// [theme.breakpoints.up("xs")]: {
		// 	height: ({ small }) => (small ? "15rem" : undefined),
		// 	width: ({ small }) => (small ? "15rem" : undefined),
		// },
	},
	product: {
		height: "20rem",
		width: "20rem",
		// [theme.breakpoints.down("xs")]: {
		// 	height: "15rem",
		// 	width: "15rem",
		// },
		// [theme.breakpoints.up("xs")]: {
		// 	height: ({ small }) => (small ? "12rem" : undefined),
		// 	width: ({ small }) => (small ? "12rem" : undefined),
		// },
	},
	title: {
		backgroundColor: theme.palette.primary.main,
		height: "5rem",
		width: "25rem",
		display: "flex", // so that we don't have to wrap extra <Grid container> and <Grid item> around the <img> to have it centered
		justifyContent: "center",
		alignItems: "center",
		marginTop: "-0.1rem",
		// [theme.breakpoints.down("xs")]: {
		// 	width: "20rem",
		// },
		// [theme.breakpoints.up("xs")]: {
		// 	width: ({ small }) => (small ? "15rem" : undefined),
		// },
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

export default function ProductFrameGrid({
	product,
	variant,
	sizes,
	selectedSize,
	setSelectedSize,
	colors,
	selectedColor,
	setSelectedColor,
}) {
	const classes = useStyles()

	const [openDialog, setOpenDialog] = useState(false)

	const imgURL = process.env.GATSBY_STRAPI_URL + variant.images[0].url
	const productName = product.name.split(" ")[0]

	return (
		<Grid item>
			<Grid
				container
				direction="column"
				onClick={() => setOpenDialog(true)}
			>
				<Grid item classes={{ root: classes.frame }}>
					<img
						src={imgURL}
						alt={product.name}
						className={classes.product}
					/>
				</Grid>
				<Grid item classes={{ root: classes.title }}>
					<Typography variant="h5">{productName}</Typography>
				</Grid>
			</Grid>
			<QuickView
				sizes={sizes}
				selectedSize={selectedSize}
				setSelectedSize={setSelectedSize}
				colors={colors}
				selectedColor={selectedColor}
				setSelectedColor={setSelectedColor}
				open={openDialog}
				setOpen={setOpenDialog}
				url={imgURL}
				name={productName}
				price={variant.price}
				product={product}
			/>
		</Grid>
	)
}
