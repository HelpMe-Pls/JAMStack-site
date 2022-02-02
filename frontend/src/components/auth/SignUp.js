import React, { useState } from "react"
import clsx from "clsx"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"

import Fields from "./Fields"
import { EmailPassword } from "./Login"
import { setUser, setSnackbar } from "../../contexts/actions"

import addUserIcon from "../../images/add-user.svg"
import nameAdornment from "../../images/name-adornment.svg"
import forward from "../../images/forward-outline.svg"
import backward from "../../images/backwards-outline.svg"

const useStyles = makeStyles(theme => ({
	addUserIcon: {
		height: "10rem",
		width: "11rem",
		marginTop: "5rem",
	},
	facebookSignUp: {
		width: "20rem",
		borderRadius: 50,
		marginTop: "-3rem",
		[theme.breakpoints.down("xs")]: {
			width: "15rem",
		},
	},
	facebookText: {
		textTransform: "none",
		fontSize: "1.5rem",
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.3rem",
		},
	},
	navigation: {
		height: "4rem",
		width: "4rem",
	},
	visibleIcon: {
		padding: 0,
	},
	emailAdornment: {
		height: 17,
		width: 22,
		marginBottom: 10,
	},
	removeButtonMargin: {
		marginTop: 0,
	},
}))

//TODO: Try implementing an error message when the user signs up without the username
export default function SignUp({
	steps,
	setSelectedStep,
	dispatchUser,
	dispatchFeedback,
}) {
	const classes = useStyles()

	const [values, setValues] = useState({
		email: "",
		password: "",
		name: "",
	})
	const [errors, setErrors] = useState({})
	const [visible, setVisible] = useState(false)
	const [info, setInfo] = useState(false) // email and password
	const [loading, setLoading] = useState(false)

	const nameField = {
		name: {
			helperText: "you must enter a name with more than 3 characters",
			placeholder: "Name",
			startAdornment: <img src={nameAdornment} alt="name" />,
		},
	}

	const fields = info
		? EmailPassword(false, false, visible, setVisible)
		: nameField

	const disabled =
		Object.keys(errors).some(error => errors[error] === true) ||
		Object.keys(errors).length !== Object.keys(values).length // user haven't filled out all fields
	// Object.keys(errors).length < Object.keys(values).length also works but it doesn't make the most sense
	// because the opposite of < is >=, and > cases are not true

	// const disableForward = values.name.length < 4 // not exactly how i wanted but that's something
	const handleNavigate = direction => {
		if (direction === "forward") {
			setInfo(true)
		} else {
			if (info) {
				// so that it takes us to the SignUp (with name), not all the way back to Login
				setInfo(false)
			} else {
				const login = steps.find(step => step.label === "Login")

				setSelectedStep(steps.indexOf(login))
			}
		}
	}

	const handleComplete = () => {
		setLoading(true)
		axios
			.post(process.env.GATSBY_STRAPI_URL + "/auth/local/register", {
				username: values.name,
				email: values.email,
				password: values.password,
			})
			.then(response => {
				setLoading(false)
				dispatchUser(
					setUser({ ...response.data.user, jwt: response.data.jwt })
				)

				const complete = steps.find(step => step.label === "Complete")

				setSelectedStep(steps.indexOf(complete))
			})
			.catch(error => {
				const { message } = error.response.data.message[0].messages[0]
				setLoading(false)
				console.error(error)
				dispatchFeedback(setSnackbar({ status: "error", message }))
			})
	}

	return (
		<>
			<Grid item>
				<img
					src={addUserIcon}
					alt="new user"
					className={classes.addUserIcon}
				/>
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
					// gotcha: not using {!info && "a"} coz JS sees "a" as a string here, so the expression returns a boolean
					// not a component of <a>
					component={!info ? "a" : undefined}
					href={
						!info
							? `${process.env.GATSBY_STRAPI_URL}/connect/facebook`
							: undefined
					}
					disabled={loading || (info && disabled)}
					onClick={() => (info ? handleComplete() : null)}
					classes={{
						root: clsx(classes.facebookSignUp, {
							[classes.removeButtonMargin]: info,
						}),
					}}
				>
					{loading ? (
						<CircularProgress />
					) : (
						<Typography
							variant="h5"
							classes={{ root: classes.facebookText }}
						>
							sign up{info ? "" : " with Facebook"}
						</Typography>
					)}
				</Button>
			</Grid>
			<Grid item container justifyContent="space-between">
				<Grid item>
					<IconButton onClick={() => handleNavigate("backward")}>
						<img
							src={backward}
							alt="back to login"
							className={classes.navigation}
						/>
					</IconButton>
				</Grid>
				{info ? null : (
					<Grid item>
						<IconButton
							// disabled={disableForward} try this on the <img/> below
							onClick={() => handleNavigate("forward")}
						>
							<img
								src={forward}
								alt="continue registration"
								className={classes.navigation}
							/>
						</IconButton>
					</Grid>
				)}
			</Grid>
		</>
	)
}
