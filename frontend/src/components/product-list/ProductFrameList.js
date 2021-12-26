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
//import { getStockDisplay } from "../product-detail/ProductInfo"

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
		backgroundColor: theme.palette.primary.main,
		height: "100%",
		width: "100%",
		padding: "1.69rem",
		// [theme.breakpoints.down("md")]: {
		// 	height: "50%",
		// },
		// [theme.breakpoints.down("sm")]: {
		// 	height: "26rem",
		// },
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
}))

export default function ProductFrameList({
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

	const imageIndex = colorIndex(product, variant, selectedColor)

	const images =
		imageIndex !== -1 ? product.variants[imageIndex].images : variant.images

	return (
		<Grid item container>
			<Grid
				item
				xs={9}
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
							.toLowerCase()}`}
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
				xs={3}
				container
				direction="column"
				justify="space-between"
				classes={{ root: classes.info }}
			>
				<Grid
					item
					container
					direction="column"
					component={Link}
					to={`/${product.category.name.toLowerCase()}/${product.name
						.split(" ")[0]
						.toLowerCase()}`}
				>
					<Grid item>
						<Typography variant="h4">
							{product.name.split(" ")[0]}
						</Typography>
					</Grid>
					<Grid item>
						<Rating star={3.5} />
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
							69 currently in stock
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
				<QtyButton />
			</Grid>
		</Grid>
	)
}
