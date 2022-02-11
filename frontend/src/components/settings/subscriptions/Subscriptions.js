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
	chipRoot: {
		marginLeft: "1rem",
		"&:hover": {
			cursor: "pointer",
		},
	},
}))

export default function Subscriptions({ setSelectedSetting }) {
	const classes = useStyles()
	const { user, dispatchUser } = useUser()
	const { dispatchFeedback } = useFeedback()
	const [subscriptions, setSubscriptions] = useState([])
	const [loading, setLoading] = useState(null)

	useEffect(() => {
		axios
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

	// tried to implement this from your pseudo code but when i click on the <Chip/>, it just flashes up the <SelectFrequency/> for like 2ms (i.e the appearance of the <SelectFrequency/> only lasts for about 2ms, so i'm unable to choose any newFreq)
	const FrequencyWrapper = ({ value, row }) => {
		const [freq, setFreq] = useState(value)
		const handleFrequency = newFreq => {
			axios
				.put(
					process.env.GATSBY_STRAPI_URL + `/subscriptions/${row}`,
					{
						frequency: freq,
					},
					{
						headers: { Authorization: `Bearer ${user.jwt}` },
					}
				)
				.then(response => {
					const newSubscriptions = [...subscriptions]
					const subscriptionToUpdate = newSubscriptions.find(
						subscription =>
							subscription.id === response.subscription.id
					)

					const index =
						newSubscriptions.findIndex(subscriptionToUpdate)
					newSubscriptions[index].frequency = newFreq

					setSubscriptions(newSubscriptions)
					setFreq(newFreq) //this may not be necessary since setting the new subscriptions will feed the new value to the freq default state, so just play around with it and see
				})

				.catch(error => {
					console.error(error)
					dispatchFeedback(
						setSnackbar({
							status: "error",
							message:
								"There was a problem changing the subscription frequency of this product. Please try again soon.",
						})
					)
				})
		}

		return (
			<SelectFrequency
				chip={
					<Chip
						label={freq.split("_").join(" ")}
						classes={{
							root: classes.chipRoot,
							label: classes.bold,
						}}
					/>
				}
				value={freq}
				setValue={handleFrequency}
			/>
		)
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
						message:
							"Product REMOVED From your list of Subscriptions.",
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
							"There was a problem removing this product from your subcriptions. Please try again.",
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
				freq: { frequency, id },
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
			field: "freq",
			headerName: "Frequency",
			width: 250,
			sortable: false,
			renderCell: ({ value }) => (
				<FrequencyWrapper value={value.frequency} row={value.id} />
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
