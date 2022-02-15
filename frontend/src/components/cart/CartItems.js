import React from "react"
import Grid from "@material-ui/core/Grid"

import Item from "./Item"

import { useCart } from "../../contexts"
import { useIsClient } from "../../hooks"

export default function CartItems() {
	const { cart } = useCart()
	const { isClient, key } = useIsClient()

	return (
		<Grid key={key} item container direction="column" lg={6}>
			{!isClient
				? null // on the initial load
				: cart.map(item => <Item item={item} key={item.variant.id} />)}
		</Grid>
	)
}
