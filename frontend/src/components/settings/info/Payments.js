import React, { useState, useEffect } from "react"
import axios from "axios"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import CircularProgress from "@material-ui/core/CircularProgress"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import Slots from "../Slots"

import { useFeedback, useUser } from "../../../contexts"
import { setSnackbar, setUser } from "../../../contexts/actions"

import cardIcon from "../../../images/card.svg"

const useStyles = makeStyles(theme => ({
	number: {
		color: "#fff",
		marginBottom: "5rem",
		[theme.breakpoints.down("xs")]: {
			marginBottom: ({ checkout }) => (checkout ? "1rem" : "1rem"),
			fontSize: ({ checkout }) => (checkout ? "1.69rem" : "1.69rem"),
		},
	},
	removeCard: {
		backgroundColor: "#fff",
		paddingLeft: 5,
		paddingRight: 5,
		marginLeft: "2rem",
		"&:hover": {
			backgroundColor: "#fff",
		},
		[theme.breakpoints.down("xs")]: {
			marginLeft: ({ checkout }) => (checkout ? 0 : 0),
		},
	},
	removeCardText: {
		fontSize: "1rem",
		color: theme.palette.primary.main,
		fontFamily: "Philosopher",
		fontStyle: "italic",
		padding: ({ checkout }) => (checkout ? "0px 12px" : "0px 12px"),
	},
	icon: {
		marginBottom: "3rem",
		[theme.breakpoints.down("xs")]: {
			marginBottom: ({ checkout }) => (checkout ? "3rem" : "1rem"),
		},
	},
	paymentContainer: {
		height: "100%",
		borderLeft: ({ checkout }) => (checkout ? "0px" : "4px solid #fff"),
		display: ({ checkout, selectedStep, stepNumber }) =>
			checkout && selectedStep !== stepNumber ? "none" : "flex",
		position: "relative",
		[theme.breakpoints.down("md")]: {
			height: ({ checkout }) => (!checkout ? "30rem" : "100%"), // so that it matches 120rem in total (for matchesMD) with <Edit/>, <Details/> and <Location/>
			borderLeft: ({ checkout }) => (checkout ? 0 : 0), // I have no idea y I had to pass in the {checkout} here, but if I don't, then the borderLeft still persists at <Setting/>
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
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.069rem",
		},
	},
	form: {
		width: "75%",
		borderBottom: "2px solid #fff",
		height: "2rem",
		marginTop: "-1rem",
		[theme.breakpoints.down("xs")]: {
			width: "85%",
		},
	},
	spinner: {
		marginLeft: "3rem",
	},
	switchItem: {
		width: "100%",
	},
	numberWrapper: {
		marginBottom: "6rem",
	},
}))

export default function Payments({
	stepNumber,
	user,
	slot,
	setSlot,
	card,
	setCard,
	saveCard,
	setSaveCard,
	setCardError,
	selectedStep,
	hasSubscriptionActive,
	hasSubscriptionCart,
	checkout,
}) {
	const classes = useStyles({ checkout, selectedStep, stepNumber })
	const stripe = useStripe()
	const elements = useElements()

	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const [loading, setLoading] = useState(false)

	const { dispatchFeedback } = useFeedback()
	const { dispatchUser } = useUser()

	const isCard =
		// user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536"
		!user.jwt ? { last4: "", brand: "" } : user.paymentMethods[slot]

	const removeCard = () => {
		const remainingSavedCards = user.paymentMethods.filter(
			method => method.last4 !== ""
		)
		const subscriptionPayment = user.subscriptions.find(
			subscription => subscription.paymentMethod.last4 === isCard.last4
		)

		if (
			(hasSubscriptionActive && remainingSavedCards.length === 1) ||
			subscriptionPayment
		) {
			dispatchFeedback(
				setSnackbar({
					status: "warning",
					message:
						"You cannot remove your last card with an active subscription. Please add another card first.",
				})
			)
			return
		}
		setLoading(true)

		axios
			.post(
				process.env.GATSBY_STRAPI_URL + "/orders/removeCard",
				{
					card: isCard.last4,
				},
				{
					headers: { Authorization: `Bearer ${user.jwt}` },
				}
			)
			.then(response => {
				setLoading(false)

				dispatchUser(
					// update context with the user's empty paymentMethods sent from backend\api\order\controllers\order.js\removeCard()
					setUser({
						...response.data.user,
						jwt: user.jwt,
						onboarding: true,
					})
				)
				setCardError(true) // so that the user has to enter new card details to be able to move to the next tab
				setCard({ brand: "", last4: "" })
			})
			.catch(error => {
				setLoading(false)
				console.error(error)

				dispatchFeedback(
					setSnackbar({
						status: "error",
						message:
							"There was a problem removing your card. Please try again.",
					})
				)
			})
	}

	const handleSubmit = async event => {
		event.preventDefault()

		if (!stripe || !elements) return
	}

	const handleCardChange = async event => {
		if (event.complete) {
			const cardElmt = elements.getElement(CardElement)
			const { paymentMethod } = await stripe.createPaymentMethod({
				type: "card",
				card: cardElmt,
			})

			setCard({
				brand: paymentMethod.card.brand,
				last4: paymentMethod.card.last4,
			})
			setCardError(false)
		} else {
			setCardError(true)
		}
	}

	const cardWrapper = (
		<form onSubmit={handleSubmit} className={classes.form}>
			<CardElement
				options={{
					style: {
						base: {
							fontSize: "19px",
							fontFamily: "Lucida Console",
							color: "#fff",
							iconColor: "#fff",
							"::placeholder": {
								color: "#fff",
							},
						},
					},
				}}
				onChange={handleCardChange}
			/>
		</form>
	)

	useEffect(() => {
		if (!checkout || !user.jwt) return // for Setting & "guest" users

		if (isCard.last4 !== "" || card) {
			setCard(isCard)
			setCardError(false)
		} else {
			setCard({ brand: "", last4: "" })
			setCardError(true)
		}
	}, [slot])

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
			<Grid
				item
				container
				justifyContent="center"
				classes={{
					root: clsx({
						[classes.numberWrapper]: checkout && matchesXS,
					}),
				}}
			>
				{checkout && !isCard.last4 ? cardWrapper : null}
				<Grid item>
					<Typography
						align="center"
						variant="h3"
						classes={{ root: classes.number }}
					>
						{
							isCard.last4
								? `${isCard.brand.toUpperCase()} **** **** **** ${
										isCard.last4
								  }` // exists a saved card
								: checkout
								? null // this case we already rendered <cardWrapper/>
								: "Add A New Card During Checkout" // for Settings
						}
					</Typography>
				</Grid>
				{isCard.last4 && (
					<Grid
						item
						classes={{
							root: clsx({
								[classes.spinner]: loading,
							}),
						}}
					>
						{loading ? (
							<CircularProgress color="secondary" />
						) : (
							<Button
								onClick={removeCard}
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
						)}
					</Grid>
				)}
			</Grid>
			<Grid
				item
				container
				justifyContent="space-between"
				classes={{ root: classes.slotContainer }}
			>
				{user.username !== "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536" && (
					<Slots slot={slot} setSlot={setSlot} noLabel />
				)}
				{checkout &&
					user.username !== "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536" && (
						<Grid
							item
							classes={{
								root: clsx({
									[classes.switchItem]: matchesXS,
								}),
							}}
						>
							<FormControlLabel
								classes={{
									root: classes.switchWrapper,
									label: classes.switchLabel,
								}}
								label="Save Card For Future Use"
								labelPlacement="start"
								control={
									<Switch
										disabled={
											// already exists a saved card
											user.paymentMethods[slot].last4 !==
												"" || hasSubscriptionCart
										}
										checked={
											user.paymentMethods[slot].last4 !==
												"" || hasSubscriptionCart
												? true // already exists a saved card
												: saveCard
										}
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
