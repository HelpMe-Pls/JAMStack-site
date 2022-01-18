import React from "react"
import Grid from "@material-ui/core/Grid"

import Item from "./Item"

import { useCart } from "../../contexts"

export default function CartItems() {
	const { cart } = useCart()

	return (
		<Grid item container direction="column" lg={6}>
			{cart.map(item => (
				<Item item={item} key={item.variant.id} />
			))}
		</Grid>
	)
}
