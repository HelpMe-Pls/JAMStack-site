import React, { useState, useEffect, useCallback } from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Badge from "@material-ui/core/Badge"
import { makeStyles } from "@material-ui/core/styles"

import { useCart, useFeedback } from "../../contexts"
import { addToCart, removeFromCart, setSnackbar } from "../../contexts/actions"

import Cart from "../../images/Cart"

const useStyles = makeStyles(theme => ({
	qtyText: {
		color: ({ white }) => (white ? theme.palette.secondary.main : "#fff"),
	},
	mainGroup: {
		height: "3rem",
	},
	editButtons: {
		height: "1.525rem",

		backgroundColor: ({ white }) =>
			white ? "#fff" : theme.palette.secondary.main,
		borderLeft: ({ white }) =>
			`2px solid ${white ? theme.palette.secondary.main : "#fff"}`,
		borderRight: ({ round }) => (round ? 0 : "2px solid #fff"),
		borderBottom: "none",
		borderTop: "none",
		borderRadius: ({ round }) => (round ? "0px 50px 50px 0px" : 0),
		"&:hover": {
			backgroundColor: ({ white }) =>
				white ? "#fff" : theme.palette.secondary.light,
		},
	},
	endButtons: {
		backgroundColor: ({ white }) =>
			white ? "#fff" : theme.palette.secondary.main,
		borderRadius: 50,
		border: "none",
	},
	cartButton: {
		marginLeft: "0 !important",
		transition: "background-color 0.69s ease",
	},
	minus: {
		marginTop: "-0.3rem",
	},
	minusButton: {
		borderTop: ({ white }) =>
			`2px solid ${white ? theme.palette.secondary.main : "#fff"}`,
	},
	qtyButton: {
		"&:hover": {
			backgroundColor: ({ white }) =>
				white ? "#fff" : theme.palette.secondary.main,
		},
	},
	badge: {
		color: "#fff",
		fontSize: "1rem",
		backgroundColor: theme.palette.secondary.main,
		padding: 3,
		[theme.breakpoints.down("xs")]: {
			fontSize: "0.69rem",
			height: "1.1rem",
			width: "1.1rem",
			minWidth: 0,
		},
	},
	success: {
		backgroundColor: theme.palette.success.main, // green
		"&:hover": {
			backgroundColor: theme.palette.success.main,
		},
	},
}))

export default function QtyButton({
	stock,
	variants,
	selectedVariant, // actually the index of the variant
	name, //product's name
	isCart,
	white,
	hideCartButton,
	round,
	override, // for cart's quantity in "subscription"
}) {
	const classes = useStyles({ white, round })

	const { dispatchFeedback } = useFeedback()
	const { cart, dispatchCart } = useCart()
	const existingItem = isCart
		? cart.find(item => item.variant === variants[selectedVariant])
		: null

	const [qty, setQtyState] = useState(isCart ? existingItem.qty : 1)
	const [success, setSuccess] = useState(false)

	let setQty

	if (override) {
		setQty = val => {
			// {val} is the {qty} from subscription.js
			override.setValue(val)
			setQtyState(val)
		}
	} else {
		setQty = setQtyState
	}

	// stock[selectedVariant].qty: the {qty} is from apollo\queries.js
	const handleChange = direction => {
		if (qty === stock[selectedVariant].qty && direction === "up")
			return null
		// going no lower than 1 product
		if (qty === 1 && direction === "down") return null

		const newQty = direction === "up" ? qty + 1 : qty - 1

		setQty(newQty)

		// update localStorage & context
		if (isCart) {
			if (direction === "up") {
				dispatchCart(addToCart(variants[selectedVariant], 1, name)) // already added the {stock} from handleCart(), so the context already got it, no need to add it again here
			} else if (direction === "down") {
				dispatchCart(removeFromCart(variants[selectedVariant], 1))
			}
		}
	}

	// For "Add to cart" btn: from the SECOND click and on (within 690ms), also increases the qty. The trade off for this functionality is that if qty changes (from handleChange) while the "tick" is still there, it also re-trigerring the "setTimeOut" useEffect, which causes the "tick" symbol to persist if the user clicks on the "+" or "-" button consecutively within 690ms. Therefore the case where first click is "Add to cart", then change qty (from handleChange), and "Add to cart" again (where the time between those 3 actions are LESS THAN 690ms); then the "Add to cart" on its last click acts as "handleAddOne"
	const handleAddOne = useCallback(() => {
		setQty(qty + 1)
		dispatchCart(addToCart(variants[selectedVariant], 1, name))
		if (qty >= stock[selectedVariant].qty) {
			dispatchFeedback(
				setSnackbar({
					status: "info",
					message:
						"Sorry, we only have " +
						`${stock[selectedVariant].qty}` +
						" products left in stock.",
				})
			)
		}
	}, [qty])

	const handleCart = () => {
		setSuccess(true)
		if (qty >= stock[selectedVariant].qty) {
			dispatchFeedback(
				setSnackbar({
					status: "info",
					message:
						"Sorry, we only have " +
						`${stock[selectedVariant].qty}` +
						" products left in stock.",
				})
			)
			return
		}
		dispatchCart(
			addToCart(
				variants[selectedVariant],
				qty,
				name,
				stock[selectedVariant].qty
			)
		)
	}

	// if the user adds the maximum amount of a variant (of that product) to the cart, and then switch to another variant, we should update the {qty} to reflect the stock of that newly switched to variant. E.g. red-codeblock-hoodie has 96 in stock, user adds up to 96, then switches to white-codeblock-hoodie (has 69 in stock), we should update {qty} to 69
	useEffect(() => {
		if (stock === null || stock === -1) {
			// for error cases in fetching data
			return undefined
		} else if (qty === 0 && stock[selectedVariant].qty !== 0) {
			setQty(1)
		} else if (qty > stock[selectedVariant].qty) {
			setQty(stock[selectedVariant].qty)
		}
	}, [stock, selectedVariant, qty])

	useEffect(() => {
		let timer
		if (success) {
			timer = setTimeout(() => {
				setSuccess(false)
				setQty(qty)
			}, 690)
		}

		return () => clearTimeout(timer)
	}, [success, handleAddOne])

	return (
		<Grid item>
			<ButtonGroup classes={{ root: classes.mainGroup }}>
				<Button
					disabled={!isCart}
					classes={{
						root: clsx(classes.endButtons, classes.qtyButton),
					}}
				>
					<Typography
						variant="h3"
						classes={{ root: classes.qtyText }}
					>
						{qty}
					</Typography>
				</Button>
				<ButtonGroup orientation="vertical">
					<Button
						onClick={() => handleChange("up")}
						classes={{ root: classes.editButtons }}
					>
						<Typography
							variant="h3"
							classes={{ root: classes.qtyText }}
						>
							+
						</Typography>
					</Button>
					<Button
						onClick={() => handleChange("down")}
						classes={{
							root: clsx(
								classes.editButtons,
								classes.minusButton
							),
						}}
					>
						<Typography
							variant="h3"
							classes={{
								root: clsx(classes.qtyText, classes.minus),
							}}
						>
							-
						</Typography>
					</Button>
				</ButtonGroup>
				{hideCartButton ? null : (
					<Button
						onClick={success ? handleAddOne : handleCart}
						disabled={
							stock
								? stock[selectedVariant] === 0 // disable add to cart for item that is out of stock
								: true
						}
						classes={{
							root: clsx(classes.endButtons, classes.cartButton, {
								[classes.success]: success,
							}),
						}}
					>
						{success ? (
							<Typography
								variant="h3"
								classes={{ root: classes.qtyText }}
							>
								✓
							</Typography>
						) : (
							<Badge
								overlap="circular"
								badgeContent="+"
								classes={{ badge: classes.badge }}
							>
								<Cart color="#fff" />
							</Badge>
						)}
					</Button>
				)}
			</ButtonGroup>
		</Grid>
	)
}
