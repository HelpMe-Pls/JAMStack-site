import React, { useState, useEffect, useRef } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import Fields from "../auth/Fields"
import Slots from "./Slots"
import { EmailPassword } from "../auth/Login"

import fingerprint from "../../images/fingerprint.svg"
import NameAdornment from "../../images/NameAdornment"
import PhoneAdornment from "../../images/PhoneAdornment"

const useStyles = makeStyles(theme => ({
	phoneAdornment: {
		height: 25.122,
		width: 25.173,
	},
	icon: {
		marginTop: ({ checkout }) => (checkout ? "-2rem" : undefined),
		marginBottom: ({ checkout }) => (checkout ? "1rem" : "3rem"),
		[theme.breakpoints.down("xs")]: {
			marginBottom: "0.69rem",
		},
	},
	fieldContainer: {
		marginBottom: "2rem",
		"& > :not(:first-child)": {
			marginLeft: "5rem",
		},
		[theme.breakpoints.down("xs")]: {
			marginBottom: "1.69rem",
			"& > :not(:first-child)": {
				marginLeft: 0,
				marginTop: "1.69rem",
			},
		},
	},
	fieldContainerCart: {
		"& > *": {
			marginBottom: "1rem",
		},
	},
	slotContainer: {
		position: "absolute",
		bottom: ({ checkout }) => (checkout ? -8 : 0),
	},
	slot: {
		backgroundColor: "#fff",
		borderRadius: 25,
		width: "2.5rem",
		minWidth: 0,
		height: "2.5rem",
		border: `0.15rem solid ${theme.palette.secondary.main}`,
		"&:hover": {
			backgroundColor: "#fff",
		},
	},
	slotText: {
		color: theme.palette.secondary.main,
		marginLeft: "-0.25rem",
	},
	slotWrapper: {
		marginLeft: "2rem",
		"& > :not(:first-child)": {
			marginLeft: "-0.5rem",
		},
	},
	detailsContainer: {
		height: "100%",
		display: ({ checkout, selectedStep, stepNumber }) =>
			checkout && selectedStep !== stepNumber ? "none" : "flex",
		position: "relative",
		[theme.breakpoints.down("md")]: {
			borderBottom: "4px solid #fff",
			height: ({ checkout }) => (!checkout ? "30rem" : "100%"),
		},
	},
	switchWrapper: {
		marginRight: 4,
	},
	switchLabel: {
		color: "#fff",
		fontWeight: 600,
		[theme.breakpoints.down("xs")]: {
			fontSize: "1rem",
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

export default function Details({
	user,
	edit,
	setChangesMade,
	values,
	setValues,
	errors,
	setErrors,
	slot,
	setSlot,
	saveForBilling,
	setSaveForBilling,
	billingValues,
	setBillingValues,
	checkout,
	noSlots,
	selectedStep,
	stepNumber,
}) {
	const classes = useStyles({ checkout, selectedStep, stepNumber })
	const isMounted = useRef(false)

	const [visible, setVisible] = useState(false)

	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const email_password = EmailPassword(
		false,
		false,
		visible,
		setVisible,
		true
	)
	const name_phone = {
		name: {
			helperText: "you must enter a name with more than 3 characters",
			placeholder: "Name",
			startAdornment: <NameAdornment color="#fff" />,
		},
		phone: {
			helperText: "invalid phone number",
			placeholder: "Phone",
			startAdornment: (
				<div className={classes.phoneAdornment}>
					<PhoneAdornment />
				</div>
			),
		},
	}

	let fields = [name_phone, email_password]

	if (checkout) {
		// no need to display user's password at checkout && display these fields in this particular order
		fields = [
			{
				name: name_phone.name,
				email: email_password.email,
				phone: name_phone.phone,
			},
		]
	}

	const handleValues = values => {
		if (saveForBilling === slot && !noSlots) {
			setBillingValues(values)
		}

		setValues(values)
	}

	useEffect(() => {
		if (noSlots) {
			// for "Billing Info"
			isMounted.current = false
			return
		}

		// for "Contact Info": to preserve the info when alternating on/off from the Switch
		if (isMounted.current === false) {
			isMounted.current = true
			return
		}

		// i.e. what we DON'T want is to save the info for the current slot, then go to another slot (add some other info to that slot), then turn the switch on, and our new info (that we want to save) is replaced with the info from the previous slot
		if (saveForBilling === false && isMounted.current) {
			setValues(billingValues)
		} else {
			setBillingValues(values)
		}
	}, [saveForBilling]) // the effect also get executed on first render so that's why we need the useRef() i.e. skip initial render execution

	useEffect(() => {
		if (noSlots || user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536")
			return

		if (checkout) {
			// no need to save user's password at checkout
			setValues(user.contactInfo[slot])
		} else {
			setValues({ ...user.contactInfo[slot], password: "********" }) // spread coz we don't want to save this password: "********" to the db, it's only for display
		}
	}, [slot])

	useEffect(() => {
		if (checkout) return // so that we don't have to check "Edit" & "Save" state in the <CheckoutPortal/>

		//for Settings: to check if there's ACTUAL changes in the input fields by comparing the current input with the info in localStorage
		const changed = Object.keys(user.contactInfo[slot]).some(
			field => values[field] !== user.contactInfo[slot][field]
		)

		setChangesMade(changed)
	}, [values])

	return (
		<Grid
			item
			container
			direction="column"
			lg={checkout ? 12 : 6}
			xs={12}
			alignItems="center"
			justifyContent="center"
			classes={{ root: classes.detailsContainer }}
		>
			<Grid item>
				<img
					src={fingerprint}
					alt="details settings"
					className={classes.icon}
				/>
			</Grid>
			{fields.map((pair, i) => (
				<Grid
					key={i}
					container
					justifyContent="center"
					alignItems={matchesXS || checkout ? "center" : undefined}
					direction={matchesXS || checkout ? "column" : "row"}
					classes={{
						root: clsx({
							[classes.fieldContainer]: !checkout,
							[classes.fieldContainerCart]: checkout,
						}),
					}}
				>
					<Fields
						fields={pair}
						values={
							saveForBilling === slot && !noSlots
								? billingValues
								: values
						}
						setValues={handleValues}
						errors={errors}
						setErrors={setErrors}
						isWhite
						disabled={checkout ? false : !edit}
						settings={!checkout}
					/>
				</Grid>
			))}
			{noSlots ? null : (
				<Grid
					item
					container
					justifyContent={checkout ? "space-between" : undefined}
					classes={{ root: classes.slotContainer }}
				>
					<Slots slot={slot} setSlot={setSlot} checkout={checkout} />
					{checkout && (
						<Grid item>
							<FormControlLabel
								label="Billing"
								labelPlacement="start" // label placed on the left of the Switch
								classes={{
									root: classes.switchWrapper,
									label: classes.switchLabel,
								}}
								control={
									<Switch
										checked={saveForBilling === slot}
										onChange={() =>
											setSaveForBilling(
												// so that only 1 slot of the 3 slots can be saved for billing
												saveForBilling === slot
													? false
													: slot
											)
										}
										color="secondary"
									/>
								}
							/>
						</Grid>
					)}
				</Grid>
			)}
		</Grid>
	)
}
