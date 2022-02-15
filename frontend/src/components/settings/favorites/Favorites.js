import React, { useState, useEffect } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import CircularProgress from "@material-ui/core/CircularProgress"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"

import Sizes from "../../product-list/Sizes"
import Swatches from "../../product-list/Swatches"
import QtyButton from "../../product-list/QtyButton"
import SettingsGrid from "../SettingsGrid"

import Delete from "../../../images/Delete"

import { useFeedback, useUser } from "../../../contexts"
import { setSnackbar, setUser } from "../../../contexts/actions"

const useStyles = makeStyles(() => ({
	container: {
		height: "100%",
		width: "100%",
	},
	image: {
		height: "10rem",
		width: "10rem",
	},
	name: {
		color: "#fff",
	},
	chipRoot: {
		height: "3rem",
		width: "10rem",
		borderRadius: 50,
	},
	deleteWrapper: {
		height: "2rem",
		width: "2rem",
	},
}))

export default function Favorites({ setSelectedSetting }) {
	const classes = useStyles()

	// the full list of favorites
	const [products, setProducts] = useState([])

	// the properties of each favorite item (on a row)
	const [selectedVariants, setSelectedVariants] = useState({})
	const [selectedSizes, setSelectedSizes] = useState({})
	const [selectedColors, setSelectedColors] = useState({})

	const [loading, setLoading] = useState(null)
	const { user, dispatchUser } = useUser()
	const { dispatchFeedback } = useFeedback()

	const setSelectedHelper = (selectedFunction, values, value, row) => {
		selectedFunction({ ...values, [row]: value }) // {values} is the remaining fields

		const { variants } = products.find(favorite => favorite.id === row)
		const selectedVariant = selectedVariants[row] // object

		let newVariant

		//changing color (color in hex format)
		if (value.includes("#")) {
			newVariant = variants.find(
				variant =>
					variant.size === selectedSizes[row] &&
					variant.style === variants[selectedVariant].style &&
					variant.color === value
			)
		}
		// changing size
		else {
			let newColors = []

			// get the colors for the corresponding styles & sizes
			variants.map(variant => {
				if (
					variant.size === value &&
					variants[selectedVariant].style === variant.style
				) {
					newColors.push(variant.color)
				}
			})

			// get the variant with appropriate size,style,color
			newVariant = variants.find(
				variant =>
					variant.size === value &&
					variant.style === variants[selectedVariant].style &&
					variant.color === newColors[0]
			)
		}

		setSelectedVariants({
			...selectedVariants,
			[row]: variants.indexOf(newVariant),
		})
	}

	const columns = [
		{
			field: "item",
			headerName: "Item",
			width: 250,
			renderCell: (
				{ value } // {value} is the corresponding object with {name,image} from createData(), how it works it implemented by MUI
			) => (
				<Grid container direction="column">
					<Grid item>
						<img
							src={value.image}
							alt={value.name}
							className={classes.image}
						/>
					</Grid>
					<Grid item>
						<Typography
							variant="h3"
							classes={{ root: classes.name }}
						>
							{value.name}
						</Typography>
					</Grid>
				</Grid>
			),
		},
		{
			field: "variant",
			headerName: "Variant",
			width: 275,
			sortable: false,
			renderCell: ({ value, row }) => {
				let sizes = []
				let colors = []

				value.all.map(variant => {
					sizes.push(variant.size)

					if (
						// to show only the available color(s) of the corresponding size & style
						variant.size === selectedSizes[row.id] &&
						variant.style === value.current.style
					) {
						colors.push(variant.color)
					}
				})

				return (
					<Grid container direction="column">
						<Sizes
							sizes={sizes}
							selectedSize={selectedSizes[row.id]}
							setSelectedSize={size =>
								setSelectedHelper(
									setSelectedSizes,
									selectedSizes,
									size,
									row.id
								)
							}
						/>
						<Swatches
							colors={colors}
							selectedColor={selectedColors[row.id]}
							setSelectedColor={color =>
								setSelectedHelper(
									setSelectedColors,
									selectedColors,
									color,
									row.id
								)
							}
						/>
					</Grid>
				)
			},
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 250,
			sortable: false,
			renderCell: ({ value, row }) => {
				const selectedVariant = selectedVariants[row.id]
				const stock = value.map(variant => ({ qty: variant.qty }))

				return (
					<QtyButton
						variants={value}
						selectedVariant={selectedVariant}
						name={value[selectedVariant].product.name.split(" ")[0]}
						stock={stock}
					/>
				)
			},
		},
		{
			field: "price",
			headerName: "Price",
			width: 250,
			renderCell: ({ value }) => (
				<Chip
					classes={{ root: classes.chipRoot }}
					label={`$${value}`}
				/>
			),
		},
		{
			field: "",
			width: 500,
			sortable: false,
			disableColumnMenu: true,
			renderCell: ({ row }) => (
				<IconButton
					onClick={() => handleDelete(row.id)}
					disabled={!!loading}
				>
					{loading === row.id ? (
						<CircularProgress size="2rem" color="secondary" />
					) : (
						<span className={classes.deleteWrapper}>
							<Delete />
						</span>
					)}
				</IconButton>
			),
		},
	]

	const createData = data =>
		data.map(item => {
			const selectedVariant = selectedVariants[item.id]

			return {
				item: {
					name: item.variants[selectedVariant].product.name.split(
						" "
					)[0],
					image: item.variants[selectedVariant].images[0].url,
				},
				variant: { all: item.variants, current: item.variant },
				quantity: item.variants,
				price: item.variants[selectedVariant].price,
				id: item.id,
			}
		})

	const rows =
		Object.keys(selectedVariants).length > 0 ? createData(products) : []

	const handleDelete = row => {
		setLoading(row)

		axios
			.delete(process.env.GATSBY_STRAPI_URL + `/favorites/${row}`, {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
			.then(() => {
				setLoading(null)

				// remove the favorite item from the list
				const newProducts = products.filter(
					product => product.id !== row
				)

				// remove the favorite item from the user's profile
				const newFavorites = user.favorites.filter(
					favorite => favorite.id !== row
				)
				setProducts(newProducts)
				dispatchUser(setUser({ ...user, favorites: newFavorites }))

				dispatchFeedback(
					setSnackbar({
						status: "info",
						message: "Product REMOVED From your list of Favorites.",
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

	useEffect(() => {
		axios
			.get(process.env.GATSBY_STRAPI_URL + "/favorites/userFavorites", {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
			.then(response => {
				setProducts(response.data)

				let newVariants = {}
				let newSizes = {}
				let newColors = {}

				// a single row
				response.data.forEach(favorite => {
					const found = favorite.variants.find(
						variant => variant.id === favorite.variant.id
					)

					const index = favorite.variants.indexOf(found)

					newVariants = { ...newVariants, [favorite.id]: index }
					newSizes = {
						...newSizes,
						[favorite.id]: favorite.variant.size,
					}
					newColors = {
						...newColors,
						[favorite.id]: favorite.variant.color,
					}
				})

				setSelectedSizes(newSizes)
				setSelectedColors(newColors)
				setSelectedVariants(newVariants)
			})
			.catch(error => {
				console.error(error)

				dispatchFeedback(
					setSnackbar({
						status: "error",
						message:
							"There was a problem getting your favorite products. Please try again.",
					})
				)
			})
	}, [])

	return (
		<Grid item container classes={{ root: classes.container }}>
			<SettingsGrid
				setSelectedSetting={setSelectedSetting}
				rows={rows}
				columns={columns}
				rowsPerPage={3}
			/>
		</Grid>
	)
}
