import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/ui/layout"
import CheckoutPortal from "../components/cart/CheckoutPortal"
import CartItems from "../components/cart/CartItems"

import { useUser } from "../contexts"

const useStyles = makeStyles(theme => ({
	cartContainer: {
		minHeight: "70vh", //Using {vh} to keep footer always at the bottom
	},
}))

//TODO: add a handler to redirect user to AuthPortal right after they clicked on "Add to cart" button (if they're not logged in), then after they logged in, have that product in their cart
// Already got it in backend\api\order\controllers\order.js
export default function Cart() {
	const classes = useStyles()
	const { user } = useUser()

	return (
		<Layout>
			<Grid
				container
				direction="column"
				alignItems="center"
				classes={{ root: classes.cartContainer }}
			>
				<Grid item>
					<Typography variant="h1" align="center">
						{user.username}'s Cart
					</Typography>
				</Grid>
				<Grid item container>
					<CartItems />
					<CheckoutPortal user={user} />
				</Grid>
			</Grid>
		</Layout>
	)
}
