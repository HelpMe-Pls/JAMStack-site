import React from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles, useTheme } from "@material-ui/core/styles"

import QtyButton from "../product-list/QtyButton"

import { useCart } from "../../contexts"
import { removeFromCart } from "../../contexts/actions"

import FavoriteIcon from "../ui/favorite"
// import SubscriptionIcon from "../ui/subscription"
import SubscribeIcon from "../../images/Subscription"
import DeleteIcon from "../../images/Delete"

const useStyles = makeStyles(theme => ({
	productImage: {
		height: "10rem",
		width: "10rem",
	},
	name: {
		color: theme.palette.secondary.main,
	},
	id: {
		color: theme.palette.secondary.main,
		fontSize: "1.069rem",
		[theme.breakpoints.down("xs")]: {
			fontSize: "0.869rem",
		},
	},
	actionWrapper: {
		height: "3rem",
		width: "3rem",
		marginBottom: -8,
		[theme.breakpoints.down("xs")]: {
			height: "2rem",
			width: "2rem",
		},
	},
	infoContainer: {
		width: "35rem",
		height: "8rem",
		marginLeft: "1rem",
		position: "relative",
	},
	chipWrapper: {
		position: "absolute",
		top: "3.5rem",
	},
	itemContainer: {
		margin: "2rem 0 2rem 2rem",
		[theme.breakpoints.down("md")]: {
			margin: "2rem 0",
		},
	},
	actionButton: {
		[theme.breakpoints.down("xs")]: {
			padding: "5px 6px 15px",
		},
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
	actionContainer: {
		marginBottom: "-0.5rem",
	},
}))

export default function Item({ item }) {
	const classes = useStyles()
	const theme = useTheme()
	const matchesXS = useMediaQuery(thm => thm.breakpoints.down("xs"))
	const { dispatchCart } = useCart()

	const handleDelete = () => {
		dispatchCart(removeFromCart(item.variant, item.qty))
	}

	const actions = [
		{
			component: FavoriteIcon,
			props: {
				color: theme.palette.secondary.main,
				size: matchesXS ? 2 : 3,
				buttonClass: clsx(classes.actionButton, classes.favoriteIcon),
				variant: item.variant.id,
			},
		},
		{ icon: SubscribeIcon, color: theme.palette.secondary.main },
		// {
		// 	component: SubscriptionIcon,
		// 	props: {
		// 		color: theme.palette.secondary.main,
		// 		isCart: item,
		// 		size: matchesXS ? 2 : 3,
		// 		cartFrequency: frequency,
		// 	},
		// },
		{
			icon: DeleteIcon,
			color: theme.palette.error.main,
			size: matchesXS ? "1.75rem" : "2.5rem",
			clicked: handleDelete,
		},
	]

	return (
		<Grid item container classes={{ root: classes.itemContainer }}>
			<Grid item>
				<img
					className={classes.productImage}
					src={
						process.env.GATSBY_STRAPI_URL +
						item.variant.images[0].url
					}
					alt={item.variant.id}
				/>
			</Grid>
			<Grid
				item
				container
				direction={matchesXS ? "row" : "column"}
				justifyContent="space-between"
				classes={{ root: classes.infoContainer }}
			>
				<Grid item container justifyContent="space-between">
					<Grid item>
						<Typography
							variant="h5"
							classes={{ root: classes.name }}
						>
							{item.name}
						</Typography>
					</Grid>
					<Grid item>
						<QtyButton
							name={item.name}
							selectedVariant={0}
							variants={[item.variant]}
							stock={[{ qty: item.stock }]}
							isCart
						/>
					</Grid>
				</Grid>
				<Grid item classes={{ root: classes.chipWrapper }}>
					<Chip label={`$${item.variant.price}`} />
				</Grid>
				<Grid
					item
					container
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Grid item xs={7} sm>
						<Typography
							variant="body1"
							classes={{ root: classes.id }}
						>
							ID:
							{matchesXS
								? item.variant.id.slice() // trick to display ID at full length
								: item.variant.id}
						</Typography>
					</Grid>
					<Grid
						item
						container
						justifyContent="flex-end"
						xs={5}
						sm
						classes={{ root: classes.actionContainer }}
					>
						{actions.map((action, i) => (
							<Grid item key={i}>
								{action.component ? (
									<action.component {...action.props} />
								) : (
									// Delete icon
									<IconButton
										disableRipple
										onClick={() => action.clicked()}
										classes={{ root: classes.actionButton }}
									>
										<span
											className={classes.actionWrapper}
											style={{
												height: action.size,
												width: action.size,
											}}
										>
											<action.icon color={action.color} />
										</span>
									</IconButton>
								)}
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
