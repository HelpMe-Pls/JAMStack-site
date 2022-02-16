import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import Layout from "../components/ui/layout"
import SEO from "../components/ui/seo"
import CheckoutPortal from "../components/cart/CheckoutPortal"
import CartItems from "../components/cart/CartItems"

import { useUser } from "../contexts"

const useStyles = makeStyles(theme => ({
	cartContainer: {
		minHeight: "100vh", //Using {vh} to keep footer always at the bottom
	},
	name: {
		[theme.breakpoints.down("xs")]: {
			fontSize: "3rem",
		},
	},
}))

export default function Cart() {
	const classes = useStyles()
	const { user } = useUser()
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	const items = <CartItems />
	const checkout = <CheckoutPortal user={user} />

	return (
		<Layout>
			<SEO
				title="Cart"
				description="Make one-time purchases or have a subscription for any of the amazing products at LOCO."
			/>
			<Grid
				container
				direction="column"
				alignItems="center"
				classes={{ root: classes.cartContainer }}
			>
				<Grid item>
					<Typography
						variant="h1"
						align="center"
						classes={{ root: classes.name }}
					>
						{!user.jwt ? "Your cart" : `${user.username}'s Cart`}
					</Typography>
				</Grid>
				<Grid item container>
					{/* bring checkoutPortal on top if matchesMD */}
					{matchesMD ? checkout : items}
					{matchesMD ? items : checkout}
				</Grid>
			</Grid>
		</Layout>
	)
}
