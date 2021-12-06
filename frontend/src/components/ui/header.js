import React, { useState } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { makeStyles } from "@material-ui/core/styles"

import search from "../../images/search.svg"
import cart from "../../images/cart.svg"
import account from "../../images/account-header.svg"
import IconButton from "@material-ui/core/IconButton"
import menu from "../../images/menu.svg"

const useStyles = makeStyles(theme => ({
	// implicitly takes the {theme} defined in theme.js,
	// and that {theme} object is implemented with type Theme from the MUI core, that's how it knows where to get the "theme"
	coloredIndicator: {
		backgroundColor: "red",
	},
	logoText: {
		color: theme.palette.common.offBlack,
	},
	tabs: {
		marginLeft: "auto",
		marginRight: "auto",
	},
	icon: {
		height: "5rem",
		width: "5rem",
	},
}))

export default function Header({ categories }) {
	const classes = useStyles()
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md")) // matches media breakpoints: https://mui.com/customization/breakpoints/
	const [drawerOpen, setDrawerOpen] = useState(false)
	const iOS =
		typeof navigator !== "undefined" &&
		/iPad|iPhone|iPod/.test(navigator.userAgent)

	const routes = [
		...categories,
		{ name: "Contact Us", strapiId: "contact-us" },
	]
	const tabs = ( // using parentheses as an implicit return
		<Tabs
			value={0}
			classes={{
				indicator: classes.coloredIndicator,
				root: classes.tabs,
			}} // https://mui.com/api/tabs/#css
		>
			{routes.map(route => (
				<Tab
					label={route.name} // extract the content we need (adhering to the corresponding object's structure)
					key={route.strapiId}
				/>
			))}
		</Tabs>
	)
	const drawer = (
		<SwipeableDrawer
			open={drawerOpen}
			onOpen={() => setDrawerOpen(true)}
			onClose={() => setDrawerOpen(false)}
			disableBackdropTransition={!iOS}
			disableDiscovery={iOS}
		>
			<List disablePadding>
				{routes.map(route => (
					<ListItem divider button key={route.strapiId}>
						<ListItemText primary={route.name} />
					</ListItem>
				))}
			</List>
		</SwipeableDrawer>
	)

	return (
		<AppBar color="transparent" elevation={0}>
			<Toolbar>
				<Button>
					<Typography variant="h1">
						<span className={classes.logoText}>VAR </span>X
					</Typography>
				</Button>
				{matchesMD ? drawer : tabs}
				<IconButton>
					<img className={classes.icon} src={search} alt="search" />
				</IconButton>
				<IconButton>
					<img className={classes.icon} src={cart} alt="cart" />
				</IconButton>

				<IconButton
					onClick={() => (matchesMD ? setDrawerOpen(true) : null)}
				>
					<img
						className={classes.icon}
						src={matchesMD ? menu : account}
						alt={matchesMD ? "menu" : "account"}
					/>
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}
