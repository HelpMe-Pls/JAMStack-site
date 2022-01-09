import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import axios from "axios"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"

import { makeStyles } from "@material-ui/core/styles"

import Fields from "./Fields"
import { setUser, setSnackbar } from "../../contexts/actions"

import accountIcon from "../../images/account.svg"
import EmailAdornment from "../../images/EmailAdornment"
import PasswordAdornment from "../../images/PasswordAdornment"
import HidePasswordIcon from "../../images/HidePassword"
import ShowPasswordIcon from "../../images/ShowPassword"
import addUserIcon from "../../images/add-user.svg"
import forgotPasswordIcon from "../../images/forgot.svg"
import close from "../../images/close.svg"

const useStyles = makeStyles(theme => ({
	accountIcon: {
		marginTop: "2rem",
	},
	login: {
		width: "20rem",
		borderRadius: 15,
		textTransform: "none",
		[theme.breakpoints.down("xs")]: {
			width: "15rem",
		},
	},
	facebookText: {
		fontSize: "1.5rem",
		fontWeight: 600,
		textTransform: "none",
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.3rem",
		},
	},
	facebookButton: {
		marginTop: "-1rem",
	},
	passwordError: {
		marginTop: 0,
	},
	close: {
		paddingTop: 6,
	},
	reset: {
		marginTop: "-4rem",
	},
	buttonText: {
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.69rem",
		},
	},
	emailAdornment: {
		height: 17,
		width: 22,
		marginBottom: 10,
	},
	visibleIcon: {
		padding: 0,
	},
}))

export const EmailPassword = (
	classes,
	hideEmail,
	hidePassword,
	visible,
	setVisible,
	isWhite
) => ({
	email: {
		helperText: "invalid email",
		placeholder: "Email",
		type: "text",
		hidden: hideEmail,
		startAdornment: (
			<span style={{ height: 17, width: 22, marginBottom: 10 }}>
				<EmailAdornment color={isWhite ? "#fff" : null} />
			</span>
		),
	},
	password: {
		helperText:
			"your password must be at least eight characters and include one uppercase letter, one number, and one special character",
		placeholder: "Password",
		hidden: hidePassword,
		type: visible ? "text" : "password",
		startAdornment: <PasswordAdornment color={isWhite ? "#fff" : null} />,
		endAdornment: (
			<IconButton
				style={{ padding: 0 }}
				classes={{ root: classes.visibleIcon }}
				onClick={() => setVisible(!visible)}
			>
				{visible ? (
					<ShowPasswordIcon color={isWhite ? "#fff" : null} />
				) : (
					<HidePasswordIcon color={isWhite ? "#fff" : null} />
				)}
			</IconButton>
		),
	},
})

export default function Login({
	steps,
	setSelectedStep,
	dispatchUser,
	dispatchFeedback,
}) {
	const classes = useStyles()

	const [values, setValues] = useState({
		email: "",
		password: "",
	})

	const [visible, setVisible] = useState(false)
	const [forgot, setForgot] = useState(false)
	const [errors, setErrors] = useState({})

	const fields = EmailPassword(classes, false, forgot, visible, setVisible)

	const disabled =
		Object.keys(errors).some(error => errors[error] === true) ||
		Object.keys(errors).length !== Object.keys(values).length

	const navigateToSignUp = () => {
		const signUp = steps.find(step => step.label === "Sign Up")
		setSelectedStep(steps.indexOf(signUp))
	}

	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false) // a flag to start the setTimeOut

	// console.log(user)
	const handleLogin = () => {
		setLoading(true)

		axios
			.post(process.env.GATSBY_STRAPI_URL + "/auth/local", {
				identifier: values.email,
				password: values.password,
			})
			.then(response => {
				setLoading(false)
				dispatchUser(
					setUser({
						// payload
						...response.data.user,
						jwt: response.data.jwt,
						onboarding: true,
					})
				)
			})
			.catch(error => {
				const { message } = error.response.data.message[0].messages[0]
				setLoading(false)
				console.error(error)
				dispatchFeedback(setSnackbar({ status: "error", message }))
			})
	}

	const handleForgot = () => {
		setLoading(true)

		axios
			.post(process.env.GATSBY_STRAPI_URL + "/auth/forgot-password", {
				email: values.email,
			})
			.then(response => {
				//TODO: try to get rid of {response} and replace it with ()
				setLoading(false)
				setSuccess(true)
				dispatchFeedback(
					setSnackbar({
						status: "success",
						message: "Reset Code Sent, please check your email",
					})
				)
			})
			.catch(error => {
				const { message } = error.response.data.message[0].messages[0]
				setLoading(false)
				console.error(error)
				dispatchFeedback(setSnackbar({ status: "error", message }))
			})
	}

	useEffect(() => {
		if (!success) return

		// assigning the setTimeout to a const to later use it in clearTimeout
		const timer = setTimeout(() => {
			setForgot(false)
		}, 6000) // takes the user back to login page

		return () => clearTimeout(timer) // in cases the user navigates to somewhere else BEFORE the 6s finished
	}, [success])

	return (
		<>
			<Grid item classes={{ root: classes.accountIcon }}>
				<img src={accountIcon} alt="login page" />
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
					disabled={loading || (!forgot && disabled)}
					onClick={() => (forgot ? handleForgot() : handleLogin())}
					classes={{
						root: clsx(classes.login, { [classes.reset]: forgot }),
					}}
				>
					{loading ? (
						<CircularProgress />
					) : (
						<Typography
							variant="h5"
							classes={{ root: classes.buttonText }}
						>
							{forgot ? "forgot password" : "login"}
						</Typography>
					)}
				</Button>
			</Grid>
			{forgot ? null : (
				<Grid item>
					<Button
						component="a"
						href={`${process.env.GATSBY_STRAPI_URL}/connect/facebook`}
						classes={{
							root: clsx(classes.facebookButton, {
								[classes.passwordError]: errors.password,
							}),
						}}
					>
						<Typography
							variant="h3"
							classes={{ root: classes.facebookText }}
						>
							Login with Facebook
						</Typography>
					</Button>
				</Grid>
			)}
			<Grid item container justifyContent="space-between">
				<Grid item>
					<IconButton onClick={navigateToSignUp}>
						<img src={addUserIcon} alt="sign up" />
					</IconButton>
				</Grid>
				<Grid
					item
					classes={{
						root: clsx({
							[classes.close]: forgot,
						}),
					}}
				>
					<IconButton onClick={() => setForgot(!forgot)}>
						<img
							src={forgot ? close : forgotPasswordIcon}
							alt={forgot ? "back to login" : "forgot password"}
						/>
					</IconButton>
				</Grid>
			</Grid>
		</>
	)
}
