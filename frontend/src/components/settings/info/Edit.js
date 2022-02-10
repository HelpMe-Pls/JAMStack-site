import React, { useState } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import Confirmation from "./Confirmation"

import { useFeedback } from "../../../contexts"
import { setSnackbar, setUser } from "../../../contexts/actions"

import BackwardsIcon from "../../../images/BackwardsOutline"
import editIcon from "../../../images/edit.svg"
import saveIcon from "../../../images/save.svg"

const useStyles = makeStyles(theme => ({
	icon: {
		height: "6.9rem",
		width: "6.9rem",
		[theme.breakpoints.down("xs")]: {
			height: "5rem",
			width: "5rem",
		},
	},
	editContainer: {
		borderLeft: "4px solid #fff",
		[theme.breakpoints.down("md")]: {
			height: "30rem",
			borderLeft: 0,
		},
	},
}))

export default function Edit({
	setSelectedSetting,
	user,
	details,
	detailSlot,
	locations,
	locationSlot,
	isError,
	changesMade,
	edit,
	setEdit,
	dispatchUser,
}) {
	const classes = useStyles()
	const { dispatchFeedback } = useFeedback()
	const [loading, setLoading] = useState(false)
	const [dialogOpen, setDialogOpen] = useState(false)

	const handleEdit = () => {
		const { password, ...newDetails } = details
		if (password !== "********") {
			setDialogOpen(true)
		}

		if (edit && changesMade) {
			// clicked on the "Save" icon ({edit}'s value within this function is from the previous setEdit())
			// outside of this function, {edit} has the updated value
			// i.e. after the user clicked "Edit", within this function's scope,
			// {edit} === false
			setLoading(true)

			axios
				.post(
					process.env.GATSBY_STRAPI_URL +
						"/users-permissions/set-settings", // route to
					{
						details: newDetails,
						detailSlot,
						location: locations,
						locationSlot,
					},
					{ headers: { Authorization: `Bearer ${user.jwt}` } }
				)
				.then(response => {
					setLoading(false)
					dispatchFeedback(
						setSnackbar({
							status: "success",
							message: "Settings Saved Successfully",
						})
					)
					dispatchUser(
						// sending updated user details to context
						setUser({
							...response.data,
							jwt: user.jwt,
							onboarding: true,
						})
					)
				})
				.catch(error => {
					setLoading(false)
					console.error(error)
					dispatchFeedback(
						setSnackbar({
							status: "error",
							message:
								"There was a problem saving your settings, please try again.",
						})
					)
				})
		}
		if (edit && isError) {
			dispatchFeedback(
				setSnackbar({
					status: "error",
					message: "All fields must be valid before saving.",
				})
			)
			return // so that this function's execution scope is poped off the stack and the rest of the code in this function is not executed (that means the user can go back and correct the invalid field(s))
		}
		setEdit(!edit) // toggle between "Save" & "Edit" icons
	}

	return (
		<Grid
			item
			container
			lg={6}
			xs={12}
			justifyContent="space-evenly"
			alignItems="center"
			classes={{ root: classes.editContainer }}
		>
			<Grid item>
				<IconButton onClick={() => setSelectedSetting(null)}>
					<span className={classes.icon}>
						<BackwardsIcon color="#fff" />
					</span>
				</IconButton>
			</Grid>
			<Grid item>
				{loading ? (
					<CircularProgress color="secondary" size="8rem" />
				) : (
					<IconButton disabled={loading} onClick={handleEdit}>
						<img
							src={edit ? saveIcon : editIcon}
							alt={`${edit ? "save" : "edit"} settings`}
							className={classes.icon}
						/>
					</IconButton>
				)}
			</Grid>
			<Confirmation
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
				user={user}
				dispatchFeedback={dispatchFeedback}
				setSnackbar={setSnackbar}
			/>
		</Grid>
	)
}
