import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Chip from "@material-ui/core/Chip"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import Rating from "../home/Rating"
import Sizes from "./Sizes"
import Swatches from "./Swatches"
import QtyButton from "./QtyButton"
// import { getStockDisplay } from "../product-detail/ProductInfo"

import frame from "../../images/selected-frame.svg"
import explore from "../../images/explore.svg"

const useStyles = makeStyles(theme => ({
	selectedFrame: {
		backgroundImage: `url(${frame})`,
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		height: "60.4rem",
		width: "73.5rem",
		padding: "0 !important", // !important to actually get rid of all paddings
	},
	dialog: {
		maxWidth: "100%",
	},
	productImage: {
		height: "40rem",
		width: "40rem",
		marginTop: "5rem",
	},
	toolbar: {
		backgroundColor: theme.palette.primary.main,
		height: "13rem",
		marginTop: "2rem",
		padding: "0.5rem 1.5rem",
		position: "relative",
	},
	stock: {
		color: "#fff",
	},
	details: {
		color: "#fff",
		textTransform: "none",
		fontSize: "1.5rem",
	},
	exploreIcon: {
		height: "1.5rem",
		width: "2rem",
		marginLeft: "0.5rem",
	},
	detailButton: {
		padding: 0,
	},
	infoContainer: {
		height: "100%",
	},
	chipRoot: {
		transform: "scale(1.5)",
	},
	chipContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		// use {position} prop from the <toolbar>, <infoItem>, <actionsItem>
		// to fix this instead of hard coding in
		// marginLeft: "-6.69rem",
	},
	qtyContainer: {
		marginTop: "2.25rem",
	},
	infoItem: {
		position: "absolute",
		left: "1.69rem",
		height: "calc(100% - 1rem)",
	},
	actionsItem: {
		position: "absolute",
		right: "1.69rem",
	},
}))

export default function QuickView({
	open,
	setOpen,
	url,
	name,
	price,
	sizes,
	selectedSize,
	setSelectedSize,
	colors,
	selectedColor,
	setSelectedColor,
}) {
	const classes = useStyles()

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			classes={{ paper: classes.dialog }}
		>
			<DialogContent classes={{ root: classes.selectedFrame }}>
				<Grid container direction="column" alignItems="center">
					<Grid item>
						<img
							src={url}
							alt="product quick view"
							className={classes.productImage}
						/>
					</Grid>
					<Grid
						item
						container
						classes={{ root: classes.toolbar }}
						justifyContent="center" // only applies to the <Chip/>
					>
						<Grid item classes={{ root: classes.infoItem }}>
							<Grid
								container
								direction="column"
								justifyContent="space-between"
								classes={{ root: classes.infoContainer }}
							>
								<Grid item>
									<Typography variant="h4">{name}</Typography>
									<Rating star={4} />
								</Grid>
								<Grid item>
									<Typography
										variant="h3"
										classes={{ root: classes.stock }}
									>
										69 currently in stock
									</Typography>
									<Button
										classes={{ root: classes.detailButton }}
									>
										<Typography
											variant="h3"
											classes={{
												root: classes.details,
											}}
										>
											Details
										</Typography>
										<img
											src={explore}
											alt="go to product's detail page"
											className={classes.exploreIcon}
										/>
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid item classes={{ root: classes.chipContainer }}>
							<Chip
								label={`$${price}`}
								classes={{ root: classes.chipRoot }}
							/>
						</Grid>
						<Grid item classes={{ root: classes.actionsItem }}>
							<Grid container direction="column">
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
								<span className={classes.qtyContainer}>
									<QtyButton />
								</span>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	)
}
