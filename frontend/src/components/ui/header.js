import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles } from "@material-ui/core/styles"

import search from "../../images/search.svg"
import cart from "../../images/cart.svg"
import account from "../../images/account-header.svg"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles(theme => ({
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
}))

export default function Header({ categories }) {
	const classes = useStyles()
	const routes = [
		...categories,
		{ name: "Contact Us", strapiId: "contact-us" },
	]
	return (
		<AppBar color="transparent" elevation={0}>
			<Toolbar>
				<Button>
					<Typography variant="h1">
						<span className={classes.logoText}>VAR </span>X
					</Typography>
				</Button>
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
				<IconButton>
					<img src={search} alt="search" />
				</IconButton>
				<IconButton>
					<img src={cart} alt="cart" />
				</IconButton>
				<IconButton>
					<img src={account} alt="account" />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}
