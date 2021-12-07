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
import { Link } from "gatsby"

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
	logoContainer: {
		[theme.breakpoints.down("md")]: {
			marginRight: "auto",
		},
	},
	tabs: {
		marginLeft: "auto",
		marginRight: "auto",
	},
	tab: {
		...theme.typography.body1,
		fontWeight: 600,
	},
	icon: {
		height: "2.5rem",
		width: "2.5rem",
	},
	drawer: {
		backgroundColor: theme.palette.primary.main,
	},
	listItemText: {
		color: "#fff",
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
		{ name: "Contact Us", strapiId: "contact-us", path: "/contact" },
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
					component={Link}
					to={route.path || `/${route.name.toLowerCase()}`} // <route.path> is applied for "Contact Us" only
					classes={{ root: classes.tab }}
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
			classes={{ paper: classes.drawer }}
		>
			<List disablePadding>
				{routes.map(route => (
					<ListItem divider button key={route.strapiId}>
						<ListItemText
							classes={{ primary: classes.listItemText }}
							primary={route.name}
						/>
					</ListItem>
				))}
			</List>
		</SwipeableDrawer>
	)
	const actions = [
		// refractoring repetitive code
		{ icon: search, alt: "search", visible: true },
		{ icon: cart, alt: "cart", visible: true, path: "/cart" },
		{
			icon: account,
			alt: "account",
			visible: !matchesMD,
			path: "/account",
		},
		{
			icon: menu,
			alt: "menu",
			visible: matchesMD,
			onClicked: () => setDrawerOpen(true),
		},
	]

	return (
		<AppBar color="transparent" elevation={0}>
			<Toolbar>
				<Button
					classes={{ root: classes.logoContainer }}
					//https://mui.com/api/button/#css
				>
					<Typography variant="h1">
						<span className={classes.logoText}>VAR </span>X
					</Typography>
				</Button>
				{matchesMD ? drawer : tabs}
				{actions.map(action =>
					action.visible ? (
						<IconButton
							key={action.alt}
							component={Link}
							to={action.path}
						>
							<img
								className={classes.icon}
								src={action.icon}
								alt={action.alt}
								onClick={action.onClicked}
								// onClick={() => action.onClicked} wouldn't work because it returns a function, not a value
							/>
						</IconButton>
					) : null
				)}
			</Toolbar>
		</AppBar>
	)
}
