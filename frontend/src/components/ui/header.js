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
import Badge from "@material-ui/core/Badge"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import { useCart } from "../../contexts"

import search from "../../images/search.svg"
import cartIcon from "../../images/cart.svg"
import account from "../../images/account-header.svg"
import IconButton from "@material-ui/core/IconButton"
import menu from "../../images/menu.svg"

const useStyles = makeStyles(theme => ({
	// implicitly takes the {theme} defined in theme.js,
	// and that {theme} object is implemented with type Theme from the MUI core, that's how it knows where to get the "theme"
	coloredIndicator: {
		backgroundColor: "red",
	},
	logo: {
		[theme.breakpoints.down("xs")]: {
			fontSize: "3rem",
		},
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
		fontWeight: 500,
	},
	icon: {
		height: "2.5rem",
		width: "2.5rem",
		[theme.breakpoints.down("xs")]: {
			height: "2rem",
			width: "2rem",
		},
	},
	drawer: {
		backgroundColor: theme.palette.primary.main,
	},
	listItemText: {
		color: "#fff",
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
}))

export default function Header({ categories }) {
	const classes = useStyles()
	const { cart } = useCart()
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md")) // matches media breakpoints: https://mui.com/customization/breakpoints/
	const [drawerOpen, setDrawerOpen] = useState(false)

	const iOS =
		typeof navigator !== "undefined" &&
		/iPad|iPhone|iPod/.test(navigator.userAgent)

	const routes = [
		...categories,
		// adding an "extra" route adheres to the categories's structure
		{ name: "Contact Us", strapiId: "contact-us", path: "/contact" },
	]
	const activeIndex = () => {
		const itemPos = routes.indexOf(
			routes.filter(
				({ name, path }) =>
					(path || `/${name.toLowerCase()}`) ===
					`/${window.location.pathname.split("/")[1]}` //[1] to remain the active tab after navigated to ProductDetail
			)[0] // [0] to return the actual item (e.x: hats, hoodies, shirts)
		)

		return itemPos === -1 ? false : itemPos // {false} so that it points to homepage if we click on <VAR_X>
	}
	const tabs = ( // using parentheses as an implicit return
		<Tabs
			value={activeIndex()} //not using () => activeIndex() to make sure it's executed immediately on every new render
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
				{routes.map((route, i) => (
					<ListItem
						selected={activeIndex() === i}
						component={Link}
						to={route.path || `/${route.name.toLowerCase()}`}
						divider
						button
						key={route.strapiId}
					>
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
		{
			icon: search,
			alt: "search",
			visible: true,
			onClicked: () => console.log("search"),
		},
		{ icon: cartIcon, alt: "cart", visible: true, path: "/cart" },
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
		<AppBar color="transparent" elevation={0} position="static">
			<Toolbar disableGutters>
				<Button
					component={Link}
					to="/" // to homepage
					classes={{ root: classes.logoContainer }}
					//https://mui.com/api/button/#css
				>
					<Typography variant="h1" classes={{ root: classes.logo }}>
						<span className={classes.logoText}>LO</span>CO
					</Typography>
				</Button>
				{matchesMD ? drawer : tabs}
				{actions.map(action => {
					const image = (
						<img
							className={classes.icon}
							src={action.icon}
							alt={action.alt}
						/>
					)
					if (action.visible) {
						return (
							<IconButton
								key={action.alt}
								onClick={action.onClicked}
								component={action.onClicked ? undefined : Link}
								to={action.onClicked ? undefined : action.path} // so that the {path} doesn't apply for the {menu}
								// onClick={() => action.onClicked} wouldn't work because it returns a function, not a value
							>
								{action.alt === "cart" ? (
									<Badge
										overlap="circular"
										badgeContent={cart.length}
										classes={{ badge: classes.badge }}
									>
										{image}
									</Badge>
								) : (
									image
								)}
							</IconButton>
						)
					}
				})}
			</Toolbar>
		</AppBar>
	)
}
