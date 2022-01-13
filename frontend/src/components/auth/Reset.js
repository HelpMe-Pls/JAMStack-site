import React, { useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import Fields from "./Fields"
import { EmailPassword } from "./Login"

import { setSnackbar } from "../../contexts/actions"

import accountIcon from "../../images/account.svg"

//TODO: after changing password, unable to navigate to other pages from it
const useStyles = makeStyles(theme => ({
	reset: {
		width: "22rem",
		borderRadius: 50,
		textTransform: "none",
		marginBottom: "4rem",
		[theme.breakpoints.down("xs")]: {
			width: "15rem",
		},
	},
	icon: {
		marginTop: "2rem",
	},
	buttonText: {
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.69rem",
		},
	},
}))

export default function Reset({ steps, setSelectedStep, dispatchFeedback }) {
	const classes = useStyles()
	const [visible, setVisible] = useState(false)
	const [values, setValues] = useState({ password: "", confirmation: "" })
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)

	// destructuring {password} to get just the "password" field from the EmailPassword()
	const { password } = EmailPassword(true, false, visible, setVisible)
	const fields = {
		password: { ...password, placeholder: "New password" },
		confirmation: { ...password, placeholder: "Confirm new password" },
	}

	const handleReset = () => {
		setLoading(true)

		const params = new URLSearchParams(window.location.search)
		const code = params.get("code")

		axios
			.post(process.env.GATSBY_STRAPI_URL + "/auth/reset-password", {
				code,
				password: values.password,
				passwordConfirmation: values.confirmation,
			})
			.then(res => {
				setLoading(false)
				setSuccess(true)

				dispatchFeedback(
					setSnackbar({
						status: "success",
						message: "Password Reset Successfully",
					})
				)
			})
			.catch(error => {
				setLoading(false)

				const { message } = error.response.data.message[0].messages[0]
				console.error(error)

				dispatchFeedback(setSnackbar({ status: "error", message }))
			})
	}

	const disabled =
		Object.keys(errors).some(error => errors[error] === true) ||
		Object.keys(errors).length !== Object.keys(values).length ||
		values.password !== values.confirmation

	useEffect(() => {
		if (!success) return

		const timer = setTimeout(() => {
			// to clear the {code} query from the url when the user is navigated back to Login page
			window.history.replaceState(null, null, window.location.pathname)
			document.title = window.location.hostname + window.location.pathname

			const login = steps.find(step => step.label === "Login")
			setSelectedStep(steps.indexOf(login))
		}, 1690)

		return () => clearTimeout(timer)
	}, [success])

	return (
		<>
			<Grid item classes={{ root: classes.icon }}>
				<img src={accountIcon} alt="reset password page" />
			</Grid>
			<Fields
				fields={fields}
				errors={errors}
				setErrors={setErrors}
				values={values}
				setValues={setValues}
			/>
			<Grid item>
				<Button
					variant="contained"
					color="secondary"
					classes={{ root: classes.reset }}
					onClick={handleReset}
					disabled={disabled}
				>
					{loading ? (
						<CircularProgress />
					) : (
						<Typography
							variant="h5"
							classes={{ root: classes.buttonText }}
						>
							reset password
						</Typography>
					)}
				</Button>
			</Grid>
		</>
	)
}
