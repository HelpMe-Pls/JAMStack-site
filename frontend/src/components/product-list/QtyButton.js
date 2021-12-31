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

export default function QtyButton() {
	const classes = useStyles()

	const [qty, setQty] = useState(1) //TODO: add condition to set minimum qty no less than 0

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
						onClick={() => setQty(qty + 1)}
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
						onClick={() => setQty(qty - 1)}
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
