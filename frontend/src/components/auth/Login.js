import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import axios from "axios"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles } from "@material-ui/core/styles"

import Fields from "./Fields"
// import { setUser, setSnackbar } from "../../contexts/actions"
import validate from "../ui/validate"

import accountIcon from "../../images/account.svg"
import EmailAdornment from "../../images/EmailAdornment"
import PasswordAdornment from "../../images/password-adornment.svg"
import HidePasswordIcon from "../../images/hide-password.svg"
import ShowPasswordIcon from "../../images/show-password.svg"
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
			fontSize: "1.5rem",
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
	setVisible
	//isWhite
) => ({
	email: {
		helperText: "invalid email",
		placeholder: "Email",
		type: "text",
		hidden: hideEmail,
		startAdornment: (
			<span className={classes.emailAdornment}>
				<EmailAdornment />
			</span>
			// <span style={{ height: 17, width: 22, marginBottom: 10 }}>
			// 	<EmailAdornment color={isWhite ? "#fff" : null} />
			// </span>
		),
	},
	password: {
		helperText:
			"your password must be at least eight characters and include one uppercase letter, one number, and one special character",
		placeholder: "Password",
		hidden: hidePassword,
		type: visible ? "text" : "password",
		startAdornment: <img src={PasswordAdornment} alt="password" />,
		// <PasswordAdornment color={isWhite ? "#fff" : null} />,
		endAdornment: (
			<IconButton
				//style={{ padding: 0 }}
				classes={{ root: classes.visibleIcon }}
				onClick={() => setVisible(!visible)}
			>
				<img
					src={visible ? ShowPasswordIcon : HidePasswordIcon}
					alt={`${visible ? "Show" : "Hide"} password`}
				/>
				{/* {visible ? (
					<ShowPasswordIcon color={isWhite ? "#fff" : null} />
				) : (
					<HidePasswordIcon color={isWhite ? "#fff" : null} />
				)} */}
			</IconButton>
		),
	},
})

export default function Login({
	steps,
	setSelectedStep,
	// user,
	// dispatchUser,
	// dispatchFeedback,
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

	const navigateToSignUp = () => {
		const signUp = steps.find(step => step.label === "Sign Up")
		setSelectedStep(steps.indexOf(signUp))
	}

	// const [loading, setLoading] = useState(false)
	// const [success, setSuccess] = useState(false)

	// const handleLogin = () => {
	// 	setLoading(true)

	// 	axios
	// 		.post(process.env.GATSBY_STRAPI_URL + "/auth/local", {
	// 			identifier: values.email,
	// 			password: values.password,
	// 		})
	// 		.then(response => {
	// 			setLoading(false)
	// 			dispatchUser(
	// 				setUser({
	// 					...response.data.user,
	// 					jwt: response.data.jwt,
	// 					onboarding: true,
	// 				})
	// 			)
	// 		})
	// 		.catch(error => {
	// 			const { message } = error.response.data.message[0].messages[0]
	// 			setLoading(false)
	// 			console.error(error)
	// 			dispatchFeedback(setSnackbar({ status: "error", message }))
	// 		})
	// }

	// const handleForgot = () => {
	// 	setLoading(true)

	// 	axios
	// 		.post(process.env.GATSBY_STRAPI_URL + "/auth/forgot-password", {
	// 			email: values.email,
	// 		})
	// 		.then(response => {
	// 			setLoading(false)
	// 			setSuccess(true)

	// 			dispatchFeedback(
	// 				setSnackbar({
	// 					status: "success",
	// 					message: "Reset Code Sent",
	// 				})
	// 			)
	// 		})
	// 		.catch(error => {
	// 			const { message } = error.response.data.message[0].messages[0]
	// 			setLoading(false)
	// 			console.error(error)
	// 			dispatchFeedback(setSnackbar({ status: "error", message }))
	// 		})
	// }

	// const disabled =
	// 	Object.keys(errors).some(error => errors[error] === true) ||
	// 	Object.keys(errors).length !== Object.keys(values).length

	// useEffect(() => {
	// 	if (!success) return

	// 	const timer = setTimeout(() => {
	// 		setForgot(false)
	// 	}, 6000)

	// 	return () => clearTimeout(timer)
	// }, [success])

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
					classes={{
						root: clsx(classes.login, { [classes.reset]: forgot }),
					}}
				>
					<Typography variant="h5">
						{forgot ? "reset password" : " login"}
					</Typography>
				</Button>
			</Grid>
			{forgot ? null : (
				<Grid item>
					<Button
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
			<Grid item container justify="space-between">
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

			{/* <Grid item>
				<Button
					variant="contained"
					color="secondary"
					disabled={loading || (!forgot && disabled)}
					onClick={() => (forgot ? handleForgot() : handleLogin())}
					classes={{
						root: clsx(classes.login, {
							[classes.reset]: forgot,
						}),
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
							login with Facebook
						</Typography>
					</Button>
				</Grid>
			)}
			<Grid item container justify="space-between">
				<Grid item>
					<IconButton onClick={navigateSignUp}>
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
			</Grid> */}
		</>
	)
}
