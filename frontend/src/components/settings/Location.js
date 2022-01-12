import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"

import Fields from "../auth/Fields"
import Slots from "./Slots"

import { useFeedback } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

import locationIcon from "../../images/location.svg"
import streetAdornment from "../../images/street-adornment.svg"
import zipAdornment from "../../images/zip-adornment.svg"

const useStyles = makeStyles(theme => ({
	icon: {
		marginBottom: "3rem",
		[theme.breakpoints.down("xs")]: {
			marginBottom: "1rem",
		},
	},
	chipWrapper: {
		marginTop: "2rem",
		marginBottom: "3rem",
	},
	fieldContainer: {
		"& > :not(:first-child)": {
			marginTop: "2rem",
		},
	},
	slotContainer: {
		position: "absolute",
		bottom: 0,
	},
	locationContainer: {
		position: "relative",
		[theme.breakpoints.down("md")]: {
			borderBottom: "4px solid #fff",
			height: "30rem",
		},
	},
}))

export default function Location({
	user,
	edit,
	setChangesMade,
	values,
	setValues,
	slot,
	setSlot,
	errors,
	setErrors,
}) {
	const classes = useStyles()
	const [loading, setLoading] = useState(false)
	const { dispatchFeedback } = useFeedback()

	const getLocation = () => {
		setLoading(true)

		axios
			.get(
				`https://data.opendatasoft.com/api/records/1.0/search/?dataset=geonames-postal-code%40public&q=&rows=1&facet=country_code&facet=admin_name1&facet=place_name&facet=postal_code&refine.country_code=US&refine.postal_code=${values.zip}`
			)
			.then(response => {
				setLoading(false)

				const { place_name, admin_name1 } =
					response.data.records[0].fields

				setValues({ ...values, city: place_name, state: admin_name1 }) // spread to set street & zipcode as well
			})
			.catch(error => {
				setLoading(false)
				console.error(error)
				dispatchFeedback(
					setSnackbar({
						status: "error",
						message:
							"There was a problem with your zipcode (or maybe your zipcode is not found on our database), please try again.",
					})
				)
			})
	}

	useEffect(() => {
		setValues(user.locations[slot])
	}, [slot])

	useEffect(() => {
		// to check if there's ACTUAL changes in the input fields by comparing the current input with the info in localStorage
		const changed = Object.keys(user.locations[slot]).some(
			field => values[field] !== user.locations[slot][field]
		)

		setChangesMade(changed)

		if (values.zip.length === 5) {
			if (values.city) return

			getLocation()
		} else if (values.zip.length < 5 && values.city) {
			// to reset the <Chip/> when the user types in a new zipcode
			setValues({ ...values, city: "", state: "" })
		}
	}, [values])

	const fields = {
		street: {
			placeholder: "Street",
			helperText: "invalid address",
			startAdornment: <img src={streetAdornment} alt="street" />,
		},
		zip: {
			placeholder: "Zip Code",
			helperText: "invalid zip code",
			startAdornment: <img src={zipAdornment} alt="zip code" />,
		},
	}

	return (
		<Grid
			item
			container
			direction="column"
			lg={6}
			xs={12}
			alignItems="center"
			justifyContent="center"
			classes={{ root: classes.locationContainer }}
		>
			<Grid item>
				<img
					src={locationIcon}
					alt="location settings"
					className={classes.icon}
				/>
			</Grid>
			<Grid
				item
				container
				direction="column"
				alignItems="center"
				classes={{ root: classes.fieldContainer }}
			>
				<Fields
					fields={fields}
					values={values}
					setValues={setValues}
					errors={errors}
					setErrors={setErrors}
					isWhite
					disabled={!edit}
				/>
			</Grid>
			<Grid item classes={{ root: classes.chipWrapper }}>
				{loading ? (
					<CircularProgress color="secondary" />
				) : (
					<Chip
						label={
							values.city
								? `${values.city}, ${values.state}`
								: "City, State"
						}
					/>
				)}
			</Grid>
			<Grid item container classes={{ root: classes.slotContainer }}>
				<Slots slot={slot} setSlot={setSlot} />
			</Grid>
		</Grid>
	)
}
