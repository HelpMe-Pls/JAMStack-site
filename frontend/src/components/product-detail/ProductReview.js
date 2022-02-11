import React, { useState, useRef } from "react"
import axios from "axios"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import Rating from "../home/Rating"
import Fields from "../auth/Fields"

import { useFeedback } from "../../contexts"
import { setSnackbar } from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
	light: {
		color: theme.palette.primary.main,
	},
	date: {
		marginTop: "-0.5rem",
	},
	rating: {
		cursor: "pointer",
	},
	stars: { marginTop: "0.85rem" },
	review: {
		marginBottom: "3rem",
	},
	reviewButtonText: {
		color: "#fff",
		fontFamily: "Montserrat",
		fontWeight: 600,
	},
	cancelButtonText: {
		color: theme.palette.primary.main,
		fontWeight: 600,
		fontFamily: "Montserrat",
	},
	buttonContainer: {
		marginTop: "1rem",
	},
	delete: {
		backgroundColor: theme.palette.error.main,
		marginTop: "-0.05rem",
		marginLeft: "1rem",
		marginRight: "0.5rem",
		"&:hover": {
			backgroundColor: theme.palette.error.dark,
		},
	},
	"@global": {
		".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
			{
				borderBottom: `2px solid ${theme.palette.primary.main}`,
			},
		".MuiInput-underline:after": {
			borderBottom: `2px solid ${theme.palette.secondary.main}`,
		},
	},
}))

export default function ProductReview({
	user,
	product,
	reviews,
	review,
	setReviews,
	setAddReview,
}) {
	const classes = useStyles()

	const { dispatchFeedback } = useFeedback()
	const ratingRef = useRef(null)

	const foundForEdit = !review // if the user already left a review, and then clicks on the "Leave a Review" button (from ProductInfo.js), then look for the existing review of that user to prepare for editing
		? reviews.find(item => item.user.username === user.username)
		: null

	const [values, setValues] = useState({
		message: foundForEdit ? foundForEdit.text : "",
	})
	const [tempRating, setTempRating] = useState(0)
	const [rating, setRating] = useState(
		review ? review.rating : foundForEdit ? foundForEdit.rating : null
	)
	const [loading, setLoading] = useState(null)

	const fields = {
		message: {
			helperText: "",
			placeholder: "Write your review.",
		},
	}

	const handleReview = option => {
		setLoading(option === "delete" ? "delete-review" : "leave-review")

		const axiosFunction =
			option === "delete"
				? axios.delete
				: foundForEdit
				? axios.put
				: axios.post
		const route =
			foundForEdit || option === "delete"
				? `/reviews/${foundForEdit.id}`
				: "/reviews"

		const auth = { Authorization: `Bearer ${user.jwt}` }

		axiosFunction(
			process.env.GATSBY_STRAPI_URL + route,
			{
				text: values.message,
				product,
				rating,
				headers: option === "delete" ? auth : undefined, // coz DELETE request only need a header (text, product, rating is ignored)
			},
			{
				headers: auth, // DELETE request ignores this 3rd param (somehow)
			}
		)
			.then(response => {
				// the response only contains the updated review (SINGULAR)
				setLoading(null)

				switch (option) {
					case "delete":
						dispatchFeedback(
							setSnackbar({
								status: "success",
								message: "Review DELETED successfully",
							})
						)
						break

					case "edit":
						dispatchFeedback(
							setSnackbar({
								status: "info",
								message: "Review UPDATED successfully",
							})
						)
						break

					default:
						dispatchFeedback(
							setSnackbar({
								status: "success",
								message: "Product Reviewed Successfully",
							})
						)
				}

				let newReviews = [...reviews]
				const reviewIndex = newReviews.indexOf(foundForEdit)

				if (option === "delete") {
					newReviews = newReviews.filter(
						item => item !== foundForEdit
					)
				} else if (foundForEdit) {
					// update the edited review to the list of reviews
					newReviews[reviewIndex] = response.data
				} else {
					// update the list of reviews for first time leaving a new review
					newReviews = [response.data, ...newReviews]
				}

				setReviews(newReviews)
				setAddReview(false)
			})
			.catch(error => {
				setLoading(null)
				console.error(error)

				switch (option) {
					case "delete":
						dispatchFeedback(
							setSnackbar({
								status: "error",
								message:
									"There was a problem deleting your review. Please try again later.",
							})
						)
						break

					case "edit":
						dispatchFeedback(
							setSnackbar({
								status: "error",
								message:
									"There was a problem editing your review. Please try again later.",
							})
						)
						break

					default:
						dispatchFeedback(
							setSnackbar({
								status: "error",
								message:
									"There was a problem leaving your review. Please try again later.",
							})
						)
				}
			})
	}

	const buttonDisabled = foundForEdit
		? // disable the button if the user has not edit their review
		  foundForEdit.text === values.message && foundForEdit.rating === rating
		: !rating

	return (
		<Grid
			item
			container
			direction="column"
			classes={{ root: classes.review }}
		>
			<Grid item container justifyContent="space-between">
				<Grid item>
					<Typography variant="h4" classes={{ root: classes.light }}>
						{review
							? review.user.username // from apollo\queries.js
							: user.username}
					</Typography>
				</Grid>
				<Grid
					item
					classes={{
						root: clsx(classes.stars, {
							[classes.rating]: !review,
						}),
					}}
					ref={ratingRef}
					onClick={() => (review ? null : setRating(tempRating))}
					onMouseLeave={() => {
						if (tempRating > rating) {
							setTempRating(rating)
						}
					}}
					onMouseMove={e => {
						if (review) return

						const hoverRating = // explanation at lecture 385 @7:30
							((ratingRef.current.getBoundingClientRect().left -
								e.clientX) /
								ratingRef.current.getBoundingClientRect()
									.width) *
							-5

						setTempRating(Math.round(hoverRating * 2) / 2) // explanation at lecture 386 @4:35
					}}
				>
					<Rating
						star={rating > tempRating ? rating : tempRating}
						size={2.5}
					/>
				</Grid>
			</Grid>
			<Grid item>
				<Typography
					variant="h5"
					classes={{ root: clsx(classes.date, classes.light) }}
				>
					{review
						? new Date(review.updatedAt).toLocaleString("en-GB", {
								day: "numeric",
								month: "numeric",
								year: "numeric",
						  })
						: new Date().toLocaleDateString("en-GB")}
				</Typography>
			</Grid>
			<Grid item>
				{review ? (
					<Typography variant="body1">{review.text}</Typography>
				) : (
					// Add new review
					<Fields
						values={values}
						setValues={setValues}
						fields={fields}
						fullWidth
						noError
					/>
				)}
			</Grid>
			{review ? null : (
				// Add new review
				<Grid
					item
					container
					classes={{ root: classes.buttonContainer }}
				>
					<Grid item>
						{loading === "leave-review" ? (
							<CircularProgress />
						) : foundForEdit ? (
							<Button
								onClick={() => handleReview("edit")}
								disabled={buttonDisabled}
								variant="contained"
								color="primary"
							>
								<span className={classes.reviewButtonText}>
									Edit Review
								</span>
							</Button>
						) : (
							<Button
								onClick={handleReview}
								disabled={buttonDisabled}
								variant="contained"
								color="primary"
							>
								<span className={classes.reviewButtonText}>
									Leave Review
								</span>
							</Button>
						)}
					</Grid>
					{foundForEdit ? (
						<Grid item>
							{loading === "delete-review" ? (
								<CircularProgress />
							) : (
								<Button
									onClick={() => handleReview("delete")}
									variant="contained"
									classes={{ root: classes.delete }}
								>
									<span className={classes.reviewButtonText}>
										Delete
									</span>
								</Button>
							)}
						</Grid>
					) : null}
					<Grid item>
						<Button onClick={() => setAddReview(false)}>
							<span className={classes.cancelButtonText}>
								Cancel
							</span>
						</Button>
					</Grid>
				</Grid>
			)}
		</Grid>
	)
}
