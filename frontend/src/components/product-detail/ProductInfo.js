import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Chip from "@material-ui/core/Chip"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import Rating from "../home/Rating"
import Favorite from "../ui/favorite"
import Subscription from "../ui/subscription"
import Sizes from "../product-list/Sizes"
import Swatches from "../product-list/Swatches"
import QtyButton from "../product-list/QtyButton"
import { colorIndex } from "../product-list/ProductFrameGrid"

import { useUser, useFeedback } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
	background: {
		backgroundColor: theme.palette.secondary.main,
		height: "45rem",
		width: "35rem",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
		[theme.breakpoints.down("xs")]: {
			height: "58rem",
		},
	},
	center: {
		backgroundColor: theme.palette.primary.main,
		height: "35rem",
		width: "45rem",
		position: "absolute",
		[theme.breakpoints.down("lg")]: {
			width: "40rem",
		},
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
		[theme.breakpoints.down("xs")]: {
			height: "48rem",
		},
	},
	icon: {
		height: "4rem",
		width: "4rem",
	},
	subscriptionWrapper: {
		margin: "0.5rem 1rem",
	},
	favoriteWrapper: {
		margin: "0.6rem 1rem 0 0",
	},
	sectionContainer: {
		height: "calc(100% / 3)",
	},
	descriptionContainer: {
		backgroundColor: theme.palette.secondary.main,
		overflowY: "auto",
		padding: "0.5rem 1rem",
	},
	name: {
		color: "#fff",
	},
	reviewButton: {
		textTransform: "none",
		marginLeft: "-8px",
	},
	detailsContainer: {
		padding: "0.5rem 1rem",
	},
	chipContainer: {
		marginTop: "1rem",
		[theme.breakpoints.down("xs")]: {
			marginTop: 0,
			marginBottom: "1rem",
		},
	},
	chipRoot: {
		height: "3rem",
		width: "auto",
		borderRadius: 50,
	},
	chipLabel: {
		fontSize: "2rem",
	},
	stock: {
		color: "#fff",
	},
	sizesAndSwatches: {
		maxWidth: "13rem",
	},
	actionsContainer: {
		padding: "0 1rem",
	},
}))

export const getStockDisplay = (stock, variant) => {
	switch (stock) {
		case undefined:
		case null:
			return "Loading Inventory..."
		case -1:
			return "Error Loading Inventory"
		default:
			if (stock[variant].qty === 0) {
				return "Out of Stock"
			} else {
				return `${stock[variant].qty} Currently In Stock`
			}
	}
}

export default function ProductInfo({
	name,
	rating,
	setAddReview,
	description,
	variants,
	selectedVariant,
	setSelectedVariant,
	stock,
}) {
	const classes = useStyles()
	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const { user } = useUser()
	const { dispatchFeedback } = useFeedback()

	const [selectedSize, setSelectedSize] = useState(
		variants[selectedVariant].size // to display corresponding size of that variant at initial render
	)
	const [selectedColor, setSelectedColor] = useState(null)

	const sizes = []
	const colors = []
	variants.map(variant => {
		sizes.push(variant.size)

		if (
			// show only the available color(s) of a specific size
			variant.size === selectedSize &&
			variant.style === variants[selectedVariant].style
		) {
			colors.push(variant.color)
		}
	})
	// Setting the display image as the first color (colors[0]) in the swatches when the user switches the size

	const handleAddReview = () => {
		if (user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536") {
			dispatchFeedback(
				setSnackbar({
					status: "error",
					message: "You must be LOGGED IN to leave a review.",
				})
			)
			return
		}

		setAddReview(true)
		const reviewRef = document.getElementById("reviews")
		reviewRef.scrollIntoView({ behavior: "smooth" })
	}

	useEffect(() => {
		setSelectedColor(null)

		const newVariant = variants.find(
			variant =>
				variant.size === selectedSize &&
				variant.style === variants[selectedVariant].style &&
				variant.color === colors[0]
		)

		setSelectedVariant(variants.indexOf(newVariant))
	}, [selectedSize])

	const imageIndex = colorIndex(
		{ variants }, //product.variants
		variants[selectedVariant],
		selectedColor
	)

	useEffect(() => {
		if (imageIndex !== -1) {
			setSelectedVariant(imageIndex)
		}
	}, [imageIndex])

	const stockDisplay = getStockDisplay(stock, selectedVariant)

	return (
		<Grid
			item
			container
			justifyContent="center"
			alignItems="flex-end"
			direction="column"
			lg={6}
		>
			<Grid
				item
				container
				justifyContent="flex-end"
				classes={{ root: classes.background }}
			>
				<Grid item classes={{ root: classes.favoriteWrapper }}>
					<Favorite
						size={4}
						variant={variants[selectedVariant].id}
						noPadding
					/>
				</Grid>
				<Grid item classes={{ root: classes.subscriptionWrapper }}>
					<Subscription
						stock={stock}
						variant={variants[selectedVariant]}
						name={name.split(" ")[0]}
						selectedVariant={selectedVariant}
						size={4}
						noPadding
					/>
				</Grid>
			</Grid>
			<Grid
				item
				container
				direction="column"
				classes={{ root: classes.center }}
			>
				<Grid
					item
					container
					direction={matchesXS ? "column" : "row"}
					justifyContent="space-between"
					classes={{
						root: clsx(
							classes.sectionContainer,
							classes.detailsContainer
						),
					}}
				>
					<Grid item>
						<Grid container direction="column">
							<Grid item>
								<Typography
									variant="h1"
									classes={{ root: classes.name }}
								>
									{name.split(" ")[0]}
								</Typography>
							</Grid>
							<Grid item>
								<Rating star={rating} />
							</Grid>
							<Grid item>
								<Button onClick={handleAddReview}>
									<Typography
										variant="body2"
										classes={{ root: classes.reviewButton }}
									>
										Leave a Review ➯
									</Typography>
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item classes={{ root: classes.chipContainter }}>
						<Chip
							label={`$${variants[selectedVariant].price}`}
							classes={{
								root: classes.chipRoot,
								label: classes.chipLabel,
							}}
						/>
					</Grid>
				</Grid>
				<Grid
					item
					container
					classes={{
						root: clsx(
							classes.descriptionContainer,
							classes.sectionContainer
						),
					}}
				>
					<Grid item>
						<Typography variant="h5">Description</Typography>
						<Typography variant="body2">{description}</Typography>
					</Grid>
				</Grid>
				<Grid
					item
					container
					justifyContent={
						matchesXS ? "space-around" : "space-between"
					}
					direction={matchesXS ? "column" : "row"}
					alignItems={matchesXS ? "flex-start" : "center"}
					classes={{
						root: clsx(
							classes.actionsContainer,
							classes.sectionContainer
						),
					}}
				>
					<Grid item>
						<Grid container direction="column">
							<Grid
								item
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
							<Grid item>
								<Typography
									variant="h3"
									classes={{ root: classes.stock }}
								>
									{stockDisplay}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<QtyButton
							name={name}
							variants={variants}
							selectedVariant={selectedVariant}
							stock={stock}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
