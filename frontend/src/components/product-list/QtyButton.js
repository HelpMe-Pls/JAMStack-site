import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Badge from "@material-ui/core/Badge"
import { makeStyles } from "@material-ui/core/styles"

import Cart from "../../images/Cart"

const useStyles = makeStyles(theme => ({
	qtyText: {
		color: "#fff",
	},
	mainGroup: {
		height: "3rem",
	},
	editButtons: {
		height: "1.525rem",
		borderRadius: 0,
		backgroundColor: theme.palette.secondary.main,
		borderLeft: "2px solid #fff",
		borderRight: "2px solid #fff",
		borderBottom: "none",
		borderTop: "none",
	},
	endButtons: {
		backgroundColor: theme.palette.secondary.main,
		borderRadius: 50,
		border: "none",
	},
	cartButton: {
		marginLeft: "0 !important",
	},
	minus: {
		marginTop: "-0.3rem",
	},
	minusButton: {
		borderTop: "2px solid #fff",
	},
	qtyButton: {
		"&:hover": {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	badge: {
		color: "#fff",
		fontSize: "1.69rem",
		backgroundColor: theme.palette.secondary.main,
		padding: 3,
	},
}))

export default function QtyButton({
	stock,
	variants,
	selectedVariant,
	name,
	isCart,
	white,
	hideCartButton,
	round,
	override,
}) {
	const classes = useStyles()

	const [qty, setQty] = useState(1)

	const handleChange = direction => {
		if (qty === stock[selectedVariant].qty && direction === "up")
			return null
		// going no lower than 1 product
		if (qty === 1 && direction === "down") return null

		const newQty = direction === "up" ? qty + 1 : qty - 1

		setQty(newQty)
	}

	// if the user adds an amount of products to the cart, and then switch to another variant of that product,
	// we should update the {qty} to reflect the stock of that newly switched to variant
	useEffect(() => {
		if (stock === null || stock === -1) {
			// for error cases in fetching data
			return undefined
		} else if (qty > stock[selectedVariant].qty) {
			setQty(stock[selectedVariant].qty)
		}
	}, [stock, selectedVariant])

	return (
		<Grid item>
			<ButtonGroup classes={{ root: classes.mainGroup }}>
				<Button
					classes={{
						root: clsx(classes.endButtons, classes.qtyButton),
					}}
				>
					<Typography
						variant="h3"
						classes={{ root: classes.qtyText }}
					>
						{qty}
					</Typography>
				</Button>
				<ButtonGroup orientation="vertical">
					<Button
						onClick={() => handleChange("up")}
						classes={{ root: classes.editButtons }}
					>
						<Typography
							variant="h3"
							classes={{ root: classes.qtyText }}
						>
							+
						</Typography>
					</Button>
					<Button
						onClick={() => handleChange("down")}
						classes={{
							root: clsx(
								classes.editButtons,
								classes.minusButton
							),
						}}
					>
						<Typography
							variant="h3"
							classes={{
								root: clsx(classes.qtyText, classes.minus),
							}}
						>
							-
						</Typography>
					</Button>
				</ButtonGroup>
				<Button
					classes={{
						root: clsx(classes.endButtons, classes.cartButton),
					}}
				>
					<Badge
						overlap="circular"
						badgeContent="+"
						classes={{ badge: classes.badge }}
					>
						<Cart color="#fff" />
					</Badge>
				</Button>
			</ButtonGroup>
		</Grid>
	)
}
