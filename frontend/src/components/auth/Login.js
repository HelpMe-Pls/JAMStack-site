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

// import Fields from "./Fields"
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
	"@global": {
		".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
			{
				borderBottom: `2px solid ${theme.palette.secondary.main}`,
			},
		".MuiInput-underline:after": {
			borderBottom: `2px solid ${theme.palette.primary.main}`,
		},
		"input::-ms-reveal, input::-ms-clear": {
			display: "none",
		},
	},
	textField: {
		width: "20rem",
	},
	input: {
		color: theme.palette.secondary.main,
	},
	visibleIcon: {
		padding: 0,
	},
}))

// export const EmailPassword = (
// 	hideEmail,
// 	hidePassword,
// 	visible,
// 	setVisible,
// 	isWhite
// ) => ({
// 	email: {
// 		helperText: "invalid email",
// 		placeholder: "Email",
// 		type: "text",
// 		hidden: hideEmail,
// 		startAdornment: (
// 			<span style={{ height: 17, width: 22, marginBottom: 10 }}>
// 				<EmailAdornment color={isWhite ? "#fff" : null} />
// 			</span>
// 		),
// 	},
// 	password: {
// 		helperText:
// 			"your password must be at least eight characters and include one uppercase letter, one number, and one special character",
// 		placeholder: "Password",
// 		hidden: hidePassword,
// 		type: visible ? "text" : "password",
// 		startAdornment: <PasswordAdornment color={isWhite ? "#fff" : null} />,
// 		endAdornment: (
// 			<IconButton
// 				style={{ padding: 0 }}
// 				onClick={() => setVisible(!visible)}
// 			>
// 				{visible ? (
// 					<ShowPasswordIcon color={isWhite ? "#fff" : null} />
// 				) : (
// 					<HidePasswordIcon color={isWhite ? "#fff" : null} />
// 				)}
// 			</IconButton>
// 		),
// 	},
// })

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
	const [errors, setErrors] = useState({})
	const [forgot, setForgot] = useState(false)
	const fields = {
		email: {
			helperText: "invalid email",
			placeholder: "Email",
			type: "text",
			startAdornment: (
				<span className={classes.emailAdornment}>
					<EmailAdornment />
				</span>
			),
		},
		password: {
			helperText:
				"you must include at least 8 characters, one uppercase letter, one number and one special character",
			placeholder: "Password",
			type: visible ? "text" : "password",
			hidden: forgot,
			startAdornment: <img src={PasswordAdornment} alt="Password" />,
			endAdornment: (
				<img
					src={visible ? ShowPasswordIcon : HidePasswordIcon}
					alt={`${visible ? "show" : "hide"} Password`}
				/>
			),
		},
	}

	// const [loading, setLoading] = useState(false)
	// const [success, setSuccess] = useState(false)

	// const fields = EmailPassword(false, forgot, visible, setVisible)

	// const navigateSignUp = () => {
	// 	const signUp = steps.find(step => step.label === "Sign Up")

	// 	setSelectedStep(steps.indexOf(signUp))
	// }

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
			{Object.keys(fields).map(field => {
				const validateHelper = event => {
					const valid = validate({
						[field]: event.target.value,
					})
					setErrors({
						...errors,
						[field]: !valid[field],
					})
				}
				return !fields[field].hidden ? ( // email field always gets rendered
					<Grid item key={field}>
						<TextField
							value={values[field]}
							onChange={e => {
								if (errors[field]) {
									validateHelper(e)
								}

								setValues({
									...values,
									[field]: e.target.value,
								})
							}}
							placeholder={fields[field].placeholder}
							type={fields[field].type}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{fields[field].startAdornment}
									</InputAdornment>
								),
								endAdornment: fields[field].endAdornment ? (
									<InputAdornment position="end">
										<IconButton
											onClick={() => setVisible(!visible)}
											classes={{
												root: classes.visibleIcon,
											}}
										>
											{fields[field].endAdornment}
										</IconButton>
									</InputAdornment>
								) : undefined,
								classes: { input: classes.input },
							}}
							onBlur={e => validateHelper(e)}
							error={errors[field]}
							helperText={
								errors[field] && fields[field].helperText
							}
							classes={{ root: classes.textField }}
						/>
					</Grid>
				) : null
			})}
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
					<IconButton>
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
			{/* <Fields
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
