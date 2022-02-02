import React, { useState } from "react"
import axios from "axios"
import clsx from "clsx"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import { useUser, useFeedback } from "../../contexts"
import { setSnackbar, setUser } from "../../contexts/actions"

import FavoriteIcon from "../../images/Favorite"

const useStyles = makeStyles(() => ({
	icon: {
		height: ({ size }) => `${size || 2}rem`,
		width: ({ size }) => `${size || 2}rem`,
	},
	iconButton: {
		padding: ({ noPadding }) => (noPadding ? 0 : undefined),
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
}))

export default function Favorite({
	variant,
	color,
	size,
	buttonClass,
	noPadding,
}) {
	const classes = useStyles({ size, noPadding })
	const { user, dispatchUser } = useUser()
	const { dispatchFeedback } = useFeedback()
	const [loading, setLoading] = useState(false)

	const existingFavorite = user.favorites?.find(
		favorite => favorite.variant === variant
	)

	const handleFavorite = () => {
		if (user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536") {
			dispatchFeedback(
				setSnackbar({
					status: "error",
					message:
						"You must be logged in to add an item to favorites.",
				})
			)
			return
		}

		setLoading(true)

		const axiosFunction = existingFavorite ? axios.delete : axios.post
		const route = existingFavorite
			? `/favorites/${existingFavorite.id}`
			: "/favorites"
		const auth = { Authorization: `Bearer ${user.jwt}` }

		axiosFunction(
			process.env.GATSBY_STRAPI_URL + route,
			{ variant, headers: existingFavorite ? auth : undefined },
			{ headers: auth }
		)
			.then(response => {
				setLoading(false)

				if (existingFavorite) {
					dispatchFeedback(
						setSnackbar({
							status: "info",
							message: "DELETED product from Favorites",
						})
					)
				} else {
					dispatchFeedback(
						setSnackbar({
							status: "success",
							message: "ADDED product to Favorites",
						})
					)
				}

				let newFavorites = [...user.favorites]

				if (existingFavorite) {
					newFavorites = newFavorites.filter(
						favorite => favorite.id !== existingFavorite.id
					)
				} else {
					newFavorites.push({
						id: response.data.id,
						variant: response.data.variant.id,
					})
				}

				dispatchUser(setUser({ ...user, favorites: newFavorites }))
			})
			.catch(error => {
				setLoading(false)
				console.error(error)

				dispatchFeedback(
					setSnackbar({
						status: "error",
						message: `There was a problem ${
							existingFavorite ? "removing" : "adding"
						} this item ${
							existingFavorite ? "from" : "to"
						} favorites. Please try again.`,
					})
				)
			})
	}

	if (loading) return <CircularProgress size={`${size || 2}rem`} />

	return (
		<IconButton
			onClick={handleFavorite}
			classes={{ root: clsx(classes.iconButton, buttonClass) }}
		>
			<span className={classes.icon}>
				<FavoriteIcon color={color} filled={existingFavorite} />
			</span>
		</IconButton>
	)
}
