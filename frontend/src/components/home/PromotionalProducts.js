import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Carousel from "react-spring-3d-carousel"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import clsx from "clsx"
import { useStaticQuery, graphql } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"

import promoAdornment from "../../images/promo-adornment.svg"
import explore from "../../images/explore.svg"

const useStyles = makeStyles(theme => ({
	mainContainer: {
		backgroundImage: `url(${promoAdornment})`,
		backgroundPosition: "top",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		width: "100%",
		height: "70rem",
		padding: "30rem 10rem 10rem 10rem",
		[theme.breakpoints.down("lg")]: {
			padding: "20rem 2rem 2rem 2rem",
		},
		[theme.breakpoints.down("xs")]: {
			overflow: "hidden",
		},
	},
	productName: {
		color: "#fff",
	},
	carouselImage: {
		height: "30rem",
		width: "25rem",
		backgroundColor: "#fff",
		borderRadius: 20,
		boxShadow: theme.shadows[10],
		[theme.breakpoints.down("sm")]: {
			height: "25rem",
			width: "20rem",
		},
		[theme.breakpoints.down("xs")]: {
			height: "20rem",
			width: "15rem",
		},
	},
	iconButton: {
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
	carouselContainer: {
		marginLeft: "20rem",
		[theme.breakpoints.down("md")]: {
			marginLeft: 0,
			height: "30rem",
		},
	},
	space: {
		margin: "0 15rem 10rem 15rem",
		[theme.breakpoints.down("sm")]: {
			margin: "0 8rem 10rem 8rem",
		},
		[theme.breakpoints.down("xs")]: {
			margin: "0 5rem 10rem 5rem",
		},
	},
	explore: {
		textTransform: "none", // decapitalize text
		marginRight: "2rem",
	},
	descriptionContainer: {
		textAlign: "right",
		[theme.breakpoints.down("md")]: {
			textAlign: "center",
		},
	},
}))

export default function PromotionalProducts() {
	const classes = useStyles()
	const [selectedSlide, setSelectedSlide] = useState(0)
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	const data = useStaticQuery(graphql`
		query GetPromos {
			allStrapiProduct(
				filter: { promo: { eq: true } }
				sort: { fields: category___name }
			) {
				nodes {
					name
					strapiId
					description
					variants {
						images {
							url
						}
					}
				}
			}
		}
	`)

	let slideItems = []
	data.allStrapiProduct.nodes.map((product, i) =>
		slideItems.push({
			key: i,
			content: (
				<Grid container direction="column" alignItems="center">
					<Grid item>
						{/* product's image */}
						<IconButton
							disableRipple
							onClick={() => setSelectedSlide(i)}
							classes={{
								root: clsx(classes.iconButton, {
									[classes.space]: selectedSlide !== i, // to add conditional rendering for classes
								}),
							}}
						>
							{
								// extra toiling just to bring the red lightbulb hat to the front.
								i === 0 ? (
									<img
										src={
											process.env.GATSBY_STRAPI_URL +
											product.variants[4].images[0].url
										}
										alt={`product-${i}`}
										className={classes.carouselImage}
									/>
								) : i === 1 ? (
									<img
										src={
											process.env.GATSBY_STRAPI_URL +
											product.variants[1].images[0].url
										}
										alt={`product-${i}`}
										className={classes.carouselImage}
									/>
								) : i === 2 ? (
									<img
										src={
											process.env.GATSBY_STRAPI_URL +
											product.variants[0].images[0].url
										}
										alt={`product-${i}`}
										className={classes.carouselImage}
									/>
								) : null
							}
							{/* <img
								src={
									process.env.GATSBY_STRAPI_URL +
									product.variants[i + 2].images[0].url
								}
								alt={`product-${i}`}
								className={classes.carouselImage}
							/> */}
						</IconButton>
					</Grid>
					<Grid item>
						{/* product's name */}
						{selectedSlide === i ? (
							<Typography
								variant="h1"
								classes={{ root: classes.productName }}
							>
								{product.name.split(" ")[0]}
							</Typography>
						) : null}
					</Grid>
				</Grid>
			),
			description: product.description,
		})
	)

	return (
		<Grid
			container
			justify={matchesMD ? "space-around" : "space-between"}
			alignItems="center"
			classes={{ root: classes.mainContainer }}
			direction={matchesMD ? "column" : "row"}
		>
			<Grid item classes={{ root: classes.carouselContainer }}>
				<Carousel slides={slideItems} goToSlide={selectedSlide} />
			</Grid>
			<Grid item classes={{ root: classes.descriptionContainer }}>
				<Typography variant="h2" paragraph>
					{slideItems[selectedSlide].description}
				</Typography>
				<Button>
					<Typography
						variant="h4"
						classes={{ root: classes.explore }}
					>
						Explore
					</Typography>
					<img src={explore} alt="go to product page" />
				</Button>
			</Grid>
		</Grid>
	)
}
