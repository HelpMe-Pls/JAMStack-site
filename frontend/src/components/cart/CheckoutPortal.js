import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import CheckoutNavigation from "./CheckoutNavigation"
import BillingConfirmation from "./BillingConfirmation"
import Details from "../settings/info/Details"
import Location from "../settings/info/Location"
import Payments from "../settings/info/Payments"
import Shipping from "./Shipping"
import Confirmation from "./Confirmation"
import ThankYou from "./ThankYou"
import validate from "../ui/validate"

import { useCart } from "../../contexts"

const useStyles = makeStyles(theme => ({
	stepContainer: {
		width: "40rem",
		height: "25rem",
		backgroundColor: theme.palette.primary.main,
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
	container: {
		[theme.breakpoints.down("md")]: {
			marginBottom: "5rem",
		},
	},
	"@global": {
		".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
			{
				borderBottom: "2px solid #fff",
			},
		".MuiInput-underline:after": {
			borderBottom: `2px solid ${theme.palette.secondary.main}`,
		},
	},
}))

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PK)

export default function CheckoutPortal({ user }) {
	const classes = useStyles()
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	const { cart } = useCart()
	const hasSubscriptionCart = cart.some(item => item.subscription)
	const hasSubscriptionActive = user.subscriptions?.length > 0

	const [selectedStep, setSelectedStep] = useState(0)

	const [detailValues, setDetailValues] = useState({
		name: "",
		email: "",
		phone: "",
	})
	const [detailSlot, setDetailSlot] = useState(0)
	const [saveDetailForBilling, setSaveDetailForBilling] = useState(false) // manage the on/off state for the Billing switch

	// to confirm user's basic info for billing (if they didn't turn on the <Switch/> for any of the 3 slots)
	const [billingDetails, setBillingDetails] = useState({
		name: "",
		email: "",
		phone: "",
	})

	const [locationValues, setLocationValues] = useState({
		street: "",
		zip: "",
		city: "",
		state: "",
	})
	const [locationSlot, setLocationSlot] = useState(0)
	const [saveLocationForBilling, setSaveLocationForBilling] = useState(false)

	const [billingLocation, setBillingLocation] = useState({
		street: "",
		zip: "",
		city: "",
		state: "",
	})

	const [selectedShipping, setSelectedShipping] = useState(null)
	const shippingOptions = [
		{ label: "FREE SHIPPING", price: 0 },
		{ label: "2-DAY SHIPPING", price: 6.99 },
		{ label: "OVERNIGHT SHIPPING", price: 69.96 },
	]

	// for <Payments/> tab
	const [cardSlot, setCardSlot] = useState(0)
	const [card, setCard] = useState({ brand: "", last4: "" })
	const [saveCard, setSaveCard] = useState(hasSubscriptionCart)
	const [cardError, setCardError] = useState(true)

	const [errors, setErrors] = useState({})

	const [order, setOrder] = useState(null)

	// to disable the "forward to next tab" button if there's at least one error in these fields
	const errorHelper = (values, forBilling, billingValues, slot) => {
		const valid = validate(values)

		// If we have ONE slot marked as billing...
		// forBilling !== undefined is coz if the "Billing Info" tab is enabled and that means forBilling === undefined
		if (forBilling !== false && forBilling !== undefined) {
			//...validate billing values
			const billingValid = validate(billingValues)

			// If we are currently on the same slot as marked for billing, i.e. billing and shipping are the same...
			if (forBilling === slot) {
				//...then we just need to validate the one set of values because they are the same
				return Object.keys(billingValid).some(
					value => !billingValid[value]
				)
			} else {
				// Otherwise, if we are currently on a different slot with the slot marked for billing, (e.g. we marked slot 1 for billing and we're currently on slot 0), then we need to validate both the billing values, and the shipping values so we'll be able to move to the next tab from slot 0
				return (
					Object.keys(billingValid).some(
						value => !billingValid[value]
					) || Object.keys(valid).some(value => !valid[value])
				)
			}
		} else {
			// if NO slots were marked for billing, just validate current slot
			return Object.keys(valid).some(value => !valid[value])
		}
	}

	let steps = [
		{
			title: "Contact Info",
			component: (
				<Details
					user={user}
					values={detailValues}
					setValues={setDetailValues}
					errors={errors}
					setErrors={setErrors}
					slot={detailSlot}
					setSlot={setDetailSlot}
					saveForBilling={saveDetailForBilling}
					setSaveForBilling={setSaveDetailForBilling}
					billingValues={billingDetails}
					setBillingValues={setBillingDetails}
					selectedStep={selectedStep}
					checkout
				/>
			),
			hasActions: true,
			// to be used in <CheckoutNavigation/>
			error: errorHelper(
				detailValues,
				saveDetailForBilling,
				billingDetails,
				detailSlot
			),
		},
		{
			title: "Billing Info",
			component: (
				<Details
					values={billingDetails}
					setValues={setBillingDetails}
					errors={errors}
					setErrors={setErrors}
					selectedStep={selectedStep}
					checkout
					noSlots
				/>
			),
			error: errorHelper(billingDetails),
		},
		{
			title: "Address",
			component: (
				<Location
					user={user}
					values={locationValues}
					setValues={setLocationValues}
					errors={errors}
					setErrors={setErrors}
					slot={locationSlot}
					setSlot={setLocationSlot}
					saveForBilling={saveLocationForBilling}
					setSaveForBilling={setSaveLocationForBilling}
					billingValues={billingLocation}
					setBillingValues={setBillingLocation}
					selectedStep={selectedStep}
					checkout
				/>
			),
			// hasActions: true,
			error: errorHelper(
				locationValues,
				saveLocationForBilling,
				billingLocation,
				locationSlot
			),
		},
		{
			title: "Billing Address",
			component: (
				<Location
					values={billingLocation}
					setValues={setBillingLocation}
					errors={errors}
					setErrors={setErrors}
					selectedStep={selectedStep}
					checkout
					noSlots
				/>
			),
			error: errorHelper(billingLocation),
		},
		{
			title: "Shipping",
			component: (
				<Shipping
					selectedStep={selectedStep}
					shippingOptions={shippingOptions}
					selectedShipping={selectedShipping}
					setSelectedShipping={setSelectedShipping}
				/>
			),
			error: selectedShipping === null,
		},
		{
			title: "Payment",
			component: (
				<Payments
					user={user}
					slot={cardSlot}
					setSlot={setCardSlot}
					setCard={setCard}
					saveCard={saveCard}
					setSaveCard={setSaveCard}
					setCardError={setCardError}
					selectedStep={selectedStep}
					hasSubscriptionCart={hasSubscriptionCart}
					hasSubscriptionActive={hasSubscriptionActive}
					checkout
				/>
			),
			error: cardError,
		},
		{
			title: "Confirmation",
			component: (
				<Confirmation
					user={user}
					card={card}
					cardSlot={cardSlot}
					saveCard={saveCard}
					order={order}
					setOrder={setOrder}
					detailValues={detailValues}
					billingDetails={billingDetails}
					saveDetailForBilling={saveDetailForBilling}
					locationValues={locationValues}
					billingLocation={billingLocation}
					saveLocationForBilling={saveLocationForBilling}
					shippingOptions={shippingOptions}
					selectedShipping={selectedShipping}
					selectedStep={selectedStep}
					setSelectedStep={setSelectedStep}
				/>
			),
		},
		{
			title: `${
				user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536"
					? "Thank You ヾ(*⌒∇⌒*)ﾉ`"
					: `Thanks, ${user.username.split(" ")[0]}!`
			}`,
			component: (
				<ThankYou
					user={user}
					order={order}
					selectedStep={selectedStep}
					selectedShipping={selectedShipping}
				/>
			),
		},
	]

	// to not render the "Billing Info" and "Billing Address" if the <Switch/> is on for them
	// but since the Switches' state are saved with the slot's index, so we have to check if it's !false (for the case where the switch is on for slot 0, and 0 !== false)
	if (saveDetailForBilling !== false) {
		steps = steps.filter(step => step.title !== "Billing Info")
	}

	if (saveLocationForBilling !== false) {
		steps = steps.filter(step => step.title !== "Billing Address")
	}

	useEffect(() => {
		setErrors({})
	}, [detailSlot, locationSlot, selectedStep])

	return (
		<Grid
			item
			container
			direction="column"
			classes={{ root: classes.container }}
			alignItems={matchesMD ? "flex-start" : "flex-end"}
			lg={6}
		>
			<CheckoutNavigation
				steps={steps}
				selectedStep={selectedStep}
				setSelectedStep={setSelectedStep}
				details={detailValues}
				detailSlot={detailSlot}
				setDetails={setDetailValues}
				location={locationValues}
				setLocation={setLocationValues}
				locationSlot={locationSlot}
				setErrors={setErrors}
			/>
			<Grid
				item
				container
				direction="column"
				alignItems="center"
				classes={{ root: classes.stepContainer }}
			>
				<Elements stripe={stripePromise}>
					{steps.map((step, i) =>
						React.cloneElement(step.component, {
							stepNumber: i,
							key: i,
						})
					)}
				</Elements>
			</Grid>
			{steps[selectedStep].title === "Confirmation" && (
				// only render this when the "Billing Info" and/or "Billing Address" is rendered
				// i.e. hide this component when either of the switch is on
				<BillingConfirmation
					billingDetails={billingDetails}
					saveDetailForBilling={saveDetailForBilling}
					detailSlot={detailSlot}
					billingLocation={billingLocation}
					saveLocationForBilling={saveLocationForBilling}
					locationSlot={locationSlot}
				/>
			)}
		</Grid>
	)
}
