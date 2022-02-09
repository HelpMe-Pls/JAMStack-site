import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import Rating from "../home/Rating"
import Sizes from "./Sizes"
import Swatches from "./Swatches"
import QtyButton from "./QtyButton"
import { getStockDisplay } from "../product-detail/ProductInfo"

import { colorIndex } from "./ProductFrameGrid"

import frame from "../../images/product-frame-list.svg"

const useStyles = makeStyles(theme => ({
	frame: {
		backgroundImage: `url(${frame})`,
		backgroundPosition: "center",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		height: "28rem",
	},
	info: {
		backgroundColor: "#8f9ce7",
		height: "100%",
		width: "100%",
		padding: "1.69rem",
		[theme.breakpoints.down("md")]: {
			height: "50%",
		},
		[theme.breakpoints.down("sm")]: {
			height: "26rem",
		},
	},
	productImage: {
		height: "20rem",
		width: "20rem",
	},
	stock: {
		color: "#fff",
	},
	sizesAndSwatches: {
		maxWidth: "13rem",
	},
	chipLabel: {
		fontSize: "2rem",
		"&:hover": {
			cursor: "pointer",
		},
	},
	// fix weird marginTop
	"@global": {
		".MuiButtonGroup-groupedOutlinedVertical:not(:first-child)": {
			marginTop: -0.5,
		},
	},
}))

export default function ProductFrameList({
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
	stock,
}) {
	const classes = useStyles()

	const imageIndex = colorIndex(product, variant, selectedColor)

	const images =
		imageIndex !== -1 ? product.variants[imageIndex].images : variant.images
	const selectedVariant =
		imageIndex === -1 ? product.variants.indexOf(variant) : imageIndex

	const stockDisplay = getStockDisplay(stock, selectedVariant)

	return (
		<Grid item container>
			<Grid
				item
				lg={9}
				container
				justifyContent="space-around"
				alignItems="center"
				classes={{ root: classes.frame }}
			>
				{images.map(image => (
					<Grid
						item
						key={image.name}
						component={Link}
						to={`/${product.category.name.toLowerCase()}/${product.name
							.split(" ")[0]
							.toLowerCase()}${
							hasStyles ? `?style=${variant.style}` : ""
						}`}
					>
						<img
							src={process.env.GATSBY_STRAPI_URL + image.url}
							alt={image.name}
							className={classes.productImage}
						/>
					</Grid>
				))}
			</Grid>
			<Grid
				item
				lg={3}
				container
				direction="column"
				justifyContent="space-between"
				classes={{ root: classes.info }}
			>
				<Grid
					item
					container
					direction="column"
					component={Link}
					to={`/${product.category.name.toLowerCase()}/${product.name
						.split(" ")[0]
						.toLowerCase()}${
						hasStyles ? `?style=${variant.style}` : ""
					}`}
				>
					<Grid item>
						<Typography variant="h4">
							{product.name.split(" ")[0]}
						</Typography>
					</Grid>
					<Grid item>
						<Rating star={rating} />
					</Grid>
					<Grid item>
						<Chip
							label={`$${variant.price}`}
							classes={{ label: classes.chipLabel }}
						/>
					</Grid>
					<Grid item>
						<Typography
							variant="h3"
							classes={{ root: classes.stock }}
						>
							{stockDisplay}
						</Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					direction="column"
					classes={{ root: classes.sizesAndSwatches }}
				>
					<Sizes
						sizes={sizes}
						selectedSize={selectedSize}
						setSelectedSize={setSelectedSize}
					/>

					<Swatches
						colors={colors}
						selectedColor={selectedColor}
						setSelectedColor={setSelectedColor}
					/>
				</Grid>
				<QtyButton
					name={product.name.split(" ")[0]}
					variants={product.variants}
					selectedVariant={selectedVariant}
					stock={stock}
				/>
			</Grid>
		</Grid>
	)
}
