import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

import Slots from "./Slots"

import cardIcon from "../../images/card.svg"

const useStyles = makeStyles(theme => ({
	number: {
		color: "#fff",
		marginBottom: "5rem",
	},
	removeCard: {
		backgroundColor: "#fff",
		paddingLeft: 5,
		paddingRight: 5,
		marginLeft: "2rem",
		"&:hover": {
			backgroundColor: "#fff",
		},
	},
	removeCardText: {
		fontSize: "1rem",
		color: theme.palette.primary.main,
		fontFamily: "Philosopher",
		fontStyle: "italic",
	},
	icon: {
		marginBottom: "3rem",
		[theme.breakpoints.down("xs")]: {
			marginBottom: "1rem",
		},
	},
	paymentContainer: {
		borderLeft: ({ checkout }) => (checkout ? 0 : "4px solid #fff"),
		position: "relative",
		[theme.breakpoints.down("md")]: {
			height: "30rem", // so that it matches 120rem in total (for matchesMD) with <Edit/>, <Details/> and <Location/>
			borderLeft: 0,
		},
	},
	slotContainer: {
		position: "absolute",
		bottom: 0,
	},
	switchWrapper: {
		marginRight: 4,
	},
	switchLabel: {
		color: "#fff",
		fontWeight: 600,
	},
}))

export default function Payments({
	user,
	slot,
	setSlot,
	saveCard,
	setSaveCard,
	checkout,
}) {
	const classes = useStyles({ checkout })

	const card = !user.username
		? { last4: "", brand: "" }
		: user.paymentMethods[slot]

	return (
		<Grid
			item
			container
			direction="column"
			lg={checkout ? 12 : 6}
			xs={12}
			alignItems="center"
			justifyContent="center"
			classes={{ root: classes.paymentContainer }}
		>
			<Grid item>
				<img
					src={cardIcon}
					alt="payment settings"
					className={classes.icon}
				/>
			</Grid>
			<Grid item container justifyContent="center">
				<Grid item>
					<Typography
						align="center"
						variant="h3"
						classes={{ root: classes.number }}
					>
						{card.last4
							? `${card[0].brand.toUpperCase()} **** **** **** ${
									card[0].last4
							  }`
							: "Add A New Card During Checkout"}
					</Typography>
				</Grid>
				{card.last4 && (
					<Grid item>
						<Button
							variant="contained"
							classes={{ root: classes.removeCard }}
						>
							<Typography
								variant="h6"
								classes={{ root: classes.removeCardText }}
							>
								remove card
							</Typography>
						</Button>
					</Grid>
				)}
			</Grid>
			<Grid item container classes={{ root: classes.slotContainer }}>
				<Slots slot={slot} setSlot={setSlot} />
				{checkout && (
					<Grid item>
						<FormControlLabel
							classes={{
								root: classes.switchWrapper,
								label: classes.switchLabel,
							}}
							label="Save Card For Future Use"
							labelPlacement="start"
							control={
								<Switch
									checked={saveCard}
									onChange={() => setSaveCard(!saveCard)}
									color="secondary"
								/>
							}
						/>
					</Grid>
				)}
			</Grid>
		</Grid>
	)
}
