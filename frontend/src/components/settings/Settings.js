import React, { useState, useEffect } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
import { makeStyles } from "@material-ui/core/styles"

import Details from "./Details"
import Payments from "./Payments"
import Location from "./Location"
import Edit from "./Edit"

import { useUser } from "../../contexts"

const useStyles = makeStyles(theme => ({
	bottomRow: {
		borderTop: "4px solid #fff",
	},
	sectionContainer: {
		height: "50%",
	},
}))

// const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PK)

export default function Settings({ setSelectedSetting }) {
	const classes = useStyles()
	const { user, dispatchUser } = useUser()
	const [edit, setEdit] = useState(false)
	const [changesMade, setChangesMade] = useState(false)
	// const hasSubscriptionActive = user.subscriptions.length > 0

	//###### Values, Slots & Errors are lifted to this component so that when the user clicks "Save", it'll grab all these states from all those child components and be able to actually "save"
	const [detailValues, setDetailValues] = useState({
		name: "",
		phone: "",
		email: "",
		password: "********",
	})
	const [detailSlot, setDetailSlot] = useState(0)
	const [detailErrors, setDetailErrors] = useState({})

	const [locationValues, setLocationValues] = useState({
		street: "",
		zip: "",
		city: "",
		state: "",
	})
	const [locationSlot, setLocationSlot] = useState(0)
	const [locationErrors, setLocationErrors] = useState({})

	// const [billingSlot, setBillingSlot] = useState(0)

	const allErrors = { ...detailErrors, ...locationErrors }
	const isError = Object.keys(allErrors).some(
		error => allErrors[error] === true
	)

	useEffect(() => {
		setDetailErrors({})
	}, [detailSlot])

	useEffect(() => {
		setLocationErrors({})
	}, [locationSlot])

	return (
		<>
			<Grid container classes={{ root: classes.sectionContainer }}>
				<Details
					user={user}
					values={detailValues}
					setValues={setDetailValues}
					errors={detailErrors}
					setErrors={setDetailErrors}
					slot={detailSlot}
					setSlot={setDetailSlot}
					edit={edit}
					setChangesMade={setChangesMade}
				/>
				<Payments user={user} edit={edit} />
			</Grid>
			<Grid
				container
				classes={{
					root: clsx(classes.bottomRow, classes.sectionContainer),
				}}
			>
				<Location
					user={user}
					values={locationValues}
					setValues={setLocationValues}
					slot={locationSlot}
					setSlot={setLocationSlot}
					errors={locationErrors}
					setErrors={setLocationErrors}
					edit={edit}
					setChangesMade={setChangesMade}
				/>
				<Edit
					user={user}
					dispatchUser={dispatchUser}
					setSelectedSetting={setSelectedSetting}
					details={detailValues}
					detailSlot={detailSlot}
					locations={locationValues}
					locationSlot={locationSlot}
					isError={isError}
					changesMade={changesMade}
					edit={edit}
					setEdit={setEdit}
				/>
			</Grid>
		</>
		// {/* <Grid container classes={{ root: classes.sectionContainer }}>

		// 	<Elements stripe={stripePromise}>
		// 		<Payments
		// 			user={user}
		// 			edit={edit}
		// 			slot={billingSlot}
		// 			setSlot={setBillingSlot}
		// 			hasSubscriptionActive={hasSubscriptionActive}
		// 		/>
		// 	</Elements>
		// </Grid>
		//*/}
	)
}
