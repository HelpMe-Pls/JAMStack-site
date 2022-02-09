import React, { useState, useEffect } from "react"
import axios from "axios"
import clsx from "clsx"
import Chip from "@material-ui/core/Chip"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import SettingsGrid from "../SettingsGrid"
import QtyButton from "../../product-list/QtyButton"

import SelectFrequency from "../../ui/select-frequency"
import DeleteIcon from "../../../images/Delete"
import pauseIcon from "../../../images/pause.svg"

import { useUser, useFeedback } from "../../../contexts"
import { setUser, setSnackbar } from "../../../contexts/actions"

const useStyles = makeStyles(() => ({
	bold: {
		fontWeight: 600,
	},
	productImage: {
		height: "10rem",
		width: "10rem",
	},
	method: {
		color: "#fff",
		textTransform: "uppercase",
		marginTop: "1rem",
	},
	lineHeight: {
		lineHeight: 1.1,
	},
	deleteWrapper: {
		height: "3rem",
		width: "2.5rem",
	},
	pause: {
		height: "3rem",
		width: "3rem",
	},
	iconButton: {
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
}))

//TODO: implement frequency change feature
export default function Subscriptions({ setSelectedSetting }) {
	const classes = useStyles()
	const { user, dispatchUser } = useUser()
	const { dispatchFeedback } = useFeedback()
	const [subscriptions, setSubscriptions] = useState([])
	const [freq, setFreq] = useState(subscriptions.frequency) // [subscriptions] is undefined until the useEffect() kicks in, therefore setting "subscriptions.frequency" as the intial state is like a no-op
	const [loading, setLoading] = useState(null)

	useEffect(() => {
		axios
			//FIXME: move this .get to <SettingsPortal/> then pass "subs" including its "frequency" downto this component ? (tried that, didn't work)
			.get(process.env.GATSBY_STRAPI_URL + "/subscriptions/me", {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
			.then(response => setSubscriptions(response.data))
			.catch(error => {
				console.error(error)
				dispatchFeedback(
					setSnackbar({
						status: "error",
						message:
							"There was a problem retrieving your subscriptions. Please try again.",
					})
				)
			})
	}, [])

	const handleFrequency = newFrequency => {
		// {newFrequency} === event.target.value as defined in select-frequency.js
		setFreq(newFrequency)
	}

	const handleDelete = row => {
		setLoading(row)

		axios
			.delete(process.env.GATSBY_STRAPI_URL + `/subscriptions/${row}`, {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
			.then(() => {
				setLoading(null)

				// remove the favorite item from the list
				const newProducts = subscriptions.filter(
					subs => subs.id !== row
				)

				// remove the favorite item from the user's profile
				const newSubscriptions = user.subscriptions.filter(
					subs => subs.id !== row
				)
				setSubscriptions(newProducts)
				dispatchUser(
					setUser({ ...user, subscriptions: newSubscriptions })
				)

				dispatchFeedback(
					setSnackbar({
						status: "info",
						message: "Product REMOVED From Favorites.",
					})
				)
			})
			.catch(error => {
				setLoading(null)
				console.error(error)

				dispatchFeedback(
					setSnackbar({
						status: "error",
						message:
							"There was a problem removing this product from your favorites. Please try again.",
					})
				)
			})
	}

	const createData = data =>
		data.map(
			// destructuring
			({
				shippingInfo,
				shippingAddress,
				billingInfo,
				billingAddress,
				paymentMethod,
				name,
				variant,
				frequency,
				next_delivery,
				id,
			}) => ({
				details: {
					shippingInfo,
					shippingAddress,
					billingInfo,
					billingAddress,
					paymentMethod,
				},
				item: { name, variant },
				quantity: { variant, name },
				frequency,
				next_delivery,
				total: variant.price * 1.069,
				id,
			})
		)

	const columns = [
		{
			field: "details",
			headerName: "Details",
			width: 350,
			sortable: false,
			renderCell: ({ value }) => (
				<Grid container direction="column">
					<Grid item>
						<Typography
							variant="body2"
							classes={{
								root: clsx(classes.lineHeight, classes.bold),
							}}
						>
							{`${value.shippingInfo.name}`}
							<br />
							{`${value.shippingAddress.street}`}
							<br />
							{`${value.shippingAddress.city}, ${value.shippingAddress.state} ${value.shippingAddress.zip}`}
						</Typography>
					</Grid>
					<Grid item>
						<Typography
							variant="h3"
							classes={{ root: classes.method }}
						>
							{value.paymentMethod.brand}{" "}
							{value.paymentMethod.last4}
						</Typography>
					</Grid>
				</Grid>
			),
		},
		{
			field: "item",
			headerName: "Item",
			width: 250,
			sortable: false,
			renderCell: ({ value }) => (
				<Grid container direction="column" alignItems="center">
					<Grid item>
						<img
							src={
								process.env.GATSBY_STRAPI_URL +
								value.variant.images[0].url
							}
							alt={value.name}
							className={classes.productImage}
						/>
					</Grid>
					<Grid item>
						<Typography
							variant="body2"
							classes={{ root: classes.bold }}
						>
							{value.name}
						</Typography>
					</Grid>
				</Grid>
			),
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 250,
			sortable: false,
			renderCell: ({ value }) => (
				<QtyButton
					stock={[{ qty: value.variant.qty }]}
					variants={value.variant}
					selectedVariant={0}
					name={value.name}
					white
					hideCartButton
					round
				/>
			),
		},
		{
			field: "frequency",
			headerName: "Frequency",
			width: 250,
			sortable: false,
			renderCell: ({ value }) => (
				<SelectFrequency
					chip={
						<Chip
							label={value.split("_").join(" ")}
							classes={{ label: classes.bold }}
						/>
					}
					value={freq}
					setValue={handleFrequency}
				/>
			),
		},
		{
			field: "next_delivery",
			headerName: "Next Order",
			width: 250,
			renderCell: ({ value }) =>
				new Date(value).toLocaleDateString("en-GB"),
		},
		{
			field: "total",
			headerName: "Total",
			width: 250,
			renderCell: ({ value }) => (
				<Chip
					label={`$${value.toFixed(2)}`}
					classes={{ label: classes.bold }}
				/>
			),
		},
		{
			field: "",
			width: 250,
			sortable: false,
			disableColumnMenu: true,
			renderCell: ({ row }) => (
				<Grid container>
					<Grid item>
						<IconButton
							onClick={() => handleDelete(row.id)}
							disabled={!!loading}
							classes={{ root: classes.iconButton }}
						>
							{loading === row.id ? (
								<CircularProgress
									size="2rem"
									color="secondary"
								/>
							) : (
								<span className={classes.deleteWrapper}>
									<DeleteIcon />
								</span>
							)}
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton classes={{ root: classes.iconButton }}>
							<img
								src={pauseIcon}
								alt="pause subscription"
								className={classes.pause}
							/>
						</IconButton>
					</Grid>
				</Grid>
			),
		},
	]

	const rows = createData(subscriptions)

	return (
		<SettingsGrid
			setSelectedSetting={setSelectedSetting}
			rows={rows}
			columns={columns}
			rowsPerPage={3}
		/>
	)
}
