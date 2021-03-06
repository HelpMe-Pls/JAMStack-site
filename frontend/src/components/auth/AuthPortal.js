import React, { useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"

import Login from "./Login"
import SignUp from "./SignUp"
import Complete from "./Complete"
import Reset from "./Reset"

import { useUser, useFeedback } from "../../contexts"

import { setUser, setSnackbar } from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
	paper: {
		border: `2rem solid ${theme.palette.secondary.main}`,
		width: "50rem",
		height: "40rem",
		borderRadius: 0,
		[theme.breakpoints.down("md")]: {
			width: "30rem",
		},
		[theme.breakpoints.down("xs")]: {
			width: "calc(100vw - 2rem)", // 2rem from the borders on both sides
			borderWidth: "1rem",
		},
	},
	inner: {
		height: "40rem",
		width: "100%",
		border: `2rem solid ${theme.palette.primary.main}`,
		[theme.breakpoints.down("xs")]: {
			borderWidth: "1rem",
		},
	},
	container: {
		marginBottom: "8rem",
		[theme.breakpoints.down("md")]: {
			marginTop: "5rem",
		},
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
}))

export default function AuthPortal() {
	const classes = useStyles()
	const [selectedStep, setSelectedStep] = useState(0)
	const { user, dispatchUser } = useUser()
	const { feedback, dispatchFeedback } = useFeedback()

	const steps = [
		{ component: Login, label: "Login" },
		{ component: SignUp, label: "Sign Up" },
		{ component: Complete, label: "Complete" },
		{ component: Reset, label: "Reset" },
	]

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const code = params.get("code")
		const access_token = params.get("access_token")

		if (code) {
			// check if it needs to render <Reset/>
			const resetStep = steps.find(step => step.label === "Reset")
			setSelectedStep(steps.indexOf(resetStep))
		} else if (access_token) {
			// check if user's creds are valid from Fb's Auth
			axios
				.get(
					process.env.GATSBY_STRAPI_URL + "/auth/facebook/callback",
					{
						params: { access_token },
					}
				)
				.then(response => {
					dispatchUser(
						setUser({
							...response.data.user,
							jwt: response.data.jwt,
							onboarding: true,
						})
					)
					// to clear the {access_token} query from the url once the user is logged in with Fb
					window.history.replaceState(
						null,
						null,
						window.location.pathname
					)
					document.title =
						window.location.hostname + window.location.pathname
				})
				.catch(error => {
					console.error(error)
					dispatchFeedback(
						setSnackbar({
							status: "error",
							message:
								"Connecting To Facebook failed, please try again.",
						})
					)
				})
		}
	}, [])

	return (
		<Grid
			container
			justifyContent="center"
			classes={{ root: classes.container }}
		>
			<Grid item>
				<Paper elevation={15} classes={{ root: classes.paper }}>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						alignItems="center"
						classes={{ root: classes.inner }}
					>
						{steps.map((Step, i) =>
							selectedStep === i ? (
								<Step.component
									key={Step.label}
									setSelectedStep={setSelectedStep}
									steps={steps}
									user={user}
									dispatchUser={dispatchUser}
									feedback={feedback}
									dispatchFeedback={dispatchFeedback}
								/>
							) : null
						)}
					</Grid>
				</Paper>
			</Grid>
		</Grid>
	)
}
