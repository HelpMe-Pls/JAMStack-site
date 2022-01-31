import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"

import frame from "../../images/product-frame-grid.svg"
import explore from "../../images/explore.svg"
import Rating from "./Rating"

import { useQuery } from "@apollo/client"
import { GET_DETAILS } from "../../apollo/queries"

import { Link } from "gatsby"

const useStyles = makeStyles(theme => ({
	featured: {
		height: "20rem",
		width: "20rem",
		[theme.breakpoints.down("md")]: {
			height: "15rem",
			width: "15rem",
		},
	},
	frame: {
		backgroundImage: `url(${frame})`,
		backgroundPosition: "center",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		borderRadius: 0,
		height: "24.8rem",
		width: "25rem",
		boxSizing: "border-box",
		boxShadow: theme.shadows[10],
		position: "absolute", // so that the info's slide will be hidden until the user clicks on the product
		zIndex: 1, // higher {zIndex} will be put on top of lower {zIndex}s (like the stack structure)
		[theme.breakpoints.down("md")]: {
			height: "19.8rem",
			width: "20rem",
		},
	},
	productContainer: {
		// to re-adjust the position of the product's image after adding its info's silde
		margin: "5rem 0",
	},
	exploreContainer: {
		marginTop: "auto",
	},
	exploreButton: {
		textTransform: "none",
	},
	exploreIcon: {
		height: "1.5rem",
		marginLeft: "1rem",
	},
	chipLabel: {
		...theme.typography.h5,
	},
	chipRoot: {
		backgroundColor: theme.palette.secondary.main,
	},
	slide: {
		backgroundColor: theme.palette.primary.main,
		height: "20rem",
		width: "24.5rem",
		zIndex: 0,
		transition: "transform 0.5s ease",
		padding: "1rem 2rem", // so that the product's name will be fully visible
		[theme.breakpoints.down("md")]: {
			height: "15.2rem",
			width: "19.5rem",
		},
	},
	slideLeft: {
		transform: "translate(-24.5rem, 0px)", // -24.5rem so that it won't surpass the product's frame
	},
	slideRight: {
		transform: "translate(24.5rem, 0px)",
	},
	slideDown: {
		transform: "translate(0px, 17rem)",
	},
}))

export default function FeaturedProducts({
	node,
	i,
	expanded,
	setExpanded,
	matchesMD,
}) {
	const classes = useStyles()

	const [rating, setRating] = useState(0)

	const alignment = matchesMD
		? "center"
		: i === 0 || i === 3
		? "flex-start"
		: i === 1 || i === 4
		? "center"
		: "flex-end"

	const hasStyles = node.variants.some(variant => variant.style !== null)

	const { data } = useQuery(GET_DETAILS, {
		variables: { id: node.strapiId },
	})

	useEffect(() => {
		if (data) {
			setRating(data.product.rating)
		}
	}, [data])

	return (
		<Grid
			item
			container
			justifyContent={alignment}
			alignItems="center"
			key={node.strapiId}
			classes={{ root: classes.productContainer }}
		>
			{/* product's image */}
			<IconButton
				onClick={() =>
					expanded !== i ? setExpanded(i) : setExpanded(null)
				}
				classes={{ root: classes.frame }}
			>
				{/* //TODO: add extra labour to display specific products, 
							consider adding tags to the product variants that you want to display, avoid checking for every iteration like the promo's carousel*/}
				<img
					src={
						process.env.GATSBY_STRAPI_URL +
						node.variants[3].images[0].url
					}
					alt={node.name}
					className={classes.featured}
				/>
			</IconButton>

			{/* product's info */}
			<Grid
				container
				direction="column"
				classes={{
					root: clsx(classes.slide, {
						[classes.slideLeft]:
							!matchesMD &&
							expanded === i &&
							alignment === "flex-end",
						[classes.slideRight]:
							!matchesMD &&
							expanded === i &&
							(alignment === "flex-start" ||
								alignment === "center"),
						[classes.slideDown]: matchesMD && expanded === i,
					}),
				}}
			>
				<Grid item>
					<Typography variant="h4">
						{node.name.split(" ")[0]}
					</Typography>
				</Grid>
				<Grid item>
					<Rating star={rating} />
				</Grid>
				<Grid item>
					<Chip
						label={`$${node.variants[0].price}`}
						classes={{
							root: classes.chipRoot,
							label: classes.chipLabel,
						}}
					/>
				</Grid>
				<Grid item classes={{ root: classes.exploreContainer }}>
					<Button
						component={Link}
						to={`/${node.category.name.toLowerCase()}/${node.name
							.split(" ")[0]
							.toLowerCase()}${
							hasStyles ? `?style=${node.variants[1].style}` : ""
						}`}
						classes={{ root: classes.exploreButton }}
					>
						<Typography variant="h5">Details</Typography>
						<img
							src={explore}
							alt="go to product's details"
							className={classes.exploreIcon}
						/>
					</Button>
				</Grid>
			</Grid>
		</Grid>
	)
}
