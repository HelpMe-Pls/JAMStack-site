import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import { useSpring, useSprings, animated } from "react-spring"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import useResizeAware from "react-resize-aware"

import Settings from "./Settings"
import OrderHistory from "./OrderHistory"
import Favorites from "./Favorites"
// import Subscriptions from "./Subscriptions"
import { useUser } from "../../contexts"
import { setUser } from "../../contexts/actions"

import accountIcon from "../../images/account.svg"
import settingsIcon from "../../images/settings.svg"
import orderHistoryIcon from "../../images/order-history.svg"
import favoritesIcon from "../../images/favorite.svg"
import subscriptionIcon from "../../images/subscription.svg"
import background from "../../images/repeating-smallest.svg"

//TODO: re-organize files of settings into folders:
/**
 * settings
 * 		info (folder):
 * 			Settings
 * 			Details
 * 			Location
 * 			Payments
 * 			Edit
 * 			Confirmation
 * 		order-history (folder):
 * 			OrderHistory
 * 			OrderDetails
 * 			OrderDetailItem
 * 		favorites (folder):
 * 			Favorites
 * 		subscriptions (folder):
 * 			Subscriptions
 * 		SettingsPortal.js
 * 		SettingsGrid.js
 * 		Slots.js
 */

const useStyles = makeStyles(theme => ({
	name: {
		color: theme.palette.secondary.main,
	},
	dashboard: {
		width: "100%",
		minHeight: "30rem",
		height: "auto",
		backgroundImage: `url(${background})`,
		backgroundSize: "auto",
		backgroundPosition: "center",
		backgroundRepeat: "repeat",
		borderTop: ({ showComponent }) =>
			`${showComponent ? 0 : 0.5}rem solid ${theme.palette.primary.main}`,
		borderBottom: ({ showComponent }) =>
			`${showComponent ? 0 : 0.5}rem solid ${theme.palette.primary.main}`,
		margin: "5rem 0",
		[theme.breakpoints.down("md")]: {
			padding: ({ showComponent }) => (showComponent ? 0 : "5rem 0"),
			"& > :not(:last-child)": {
				marginBottom: ({ showComponent }) =>
					showComponent ? 0 : "5rem", // hide the background when stretched into <Settings/>
			},
		},
		[theme.breakpoints.down("xs")]: {
			padding: ({ showComponent }) => (showComponent ? 0 : "2rem 0"),
			"& > :not(:last-child)": {
				marginBottom: ({ showComponent }) =>
					showComponent ? 0 : "2rem",
			},
		},
	},
	icon: {
		height: "12rem",
		width: "12rem",
		[theme.breakpoints.down("lg")]: {
			height: "10rem",
			width: "10rem",
		},
		[theme.breakpoints.down("xs")]: {
			height: "5rem",
			width: "5rem",
		},
	},
	button: {
		backgroundColor: theme.palette.primary.main,
		display: "flex",
	},
	addHover: {
		"&:hover": {
			cursor: "pointer",
			backgroundColor: theme.palette.secondary.main,
		},
	},
	logout: {
		color: theme.palette.error.main,
	},
}))

const AnimatedGrid = animated(Grid)

export default function SettingsPortal() {
	const matchesLG = useMediaQuery(theme => theme.breakpoints.down("lg"))
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
	const { user, dispatchUser, defaultUser } = useUser()
	const [selectedSetting, setSelectedSetting] = useState(null)
	const [resizeListener, sizes] = useResizeAware()
	const [showComponent, setShowComponent] = useState(false)
	const classes = useStyles({ showComponent }) // place {classes} so that {showComponent} is defined

	const buttonWidth = matchesXS
		? `${sizes.width - 64}px`
		: matchesMD
		? `${sizes.width - 160}px`
		: matchesLG
		? "288px"
		: "352px"
	const buttonHeight = matchesXS
		? "15rem"
		: matchesMD
		? "22rem"
		: matchesLG
		? "18rem"
		: "22rem"

	const buttons = [
		{
			label: "Settings",
			icon: settingsIcon,
			component: Settings,
			large: true,
		},
		{
			label: "Order History",
			icon: orderHistoryIcon,
			component: OrderHistory,
		},
		{
			label: "Favorites",
			icon: favoritesIcon,
			component: Favorites,
		},
		{
			label: "Subscriptions",
			icon: subscriptionIcon,
			// component: Subscriptions,
		},
	]

	const handleClick = setting => {
		if (selectedSetting !== setting) {
			setSelectedSetting(setting)
		} else {
			setSelectedSetting(null) // second click or at initial render
		}
	}

	const handleLogout = () => {
		dispatchUser(setUser(defaultUser))
	}

	const springs = useSprings(
		buttons.length, // 4
		buttons.map(button => ({
			to: async next => {
				const scale = {
					transform:
						// these 2 cases below cannot be merged into selectedSetting !== null
						// coz then the "go back to setting Portal" wouldn't work as expected:
						// once the selected setting got de-selected, the rest of the settings won't appear
						selectedSetting === button.label ||
						selectedSetting === null
							? "scale(1)"
							: "scale(0)",
					// wait (600ms) until the selectedSetting shrinked down to
					// its original size then the rest of the settings come in (scale(1))
					delay: selectedSetting !== null ? 0 : 600,
				}

				const size = {
					height:
						selectedSetting === button.label
							? matchesMD && button.large
								? "120rem"
								: "60rem"
							: buttonHeight, // original height BEFORE navigating into <Settings/>

					width:
						selectedSetting === button.label
							? `${sizes.width}px`
							: buttonWidth,

					borderRadius: selectedSetting === button.label ? 0 : 25,
					// wait (for 600ms) until those NOT selected settings finished its scale(0) then
					// the selectedSetting is expanded
					delay: selectedSetting !== null ? 600 : 0,
				}

				const hide = {
					// explanation: lecture 246 @3:25
					display:
						selectedSetting === button.label ||
						selectedSetting === null // initial render & "go back to Portal cases" case
							? "flex"
							: "none", // for those setting buttons that are NOT selected
					delay: 150, // to wait for the shrinking/expanding effect to finish then do the hide/unhide thing
				}

				await next(selectedSetting !== null ? scale : size)
				await next(hide)
				await next(selectedSetting !== null ? size : scale)
			},
		}))
	)

	const styles = useSpring({
		opacity: selectedSetting === null || showComponent ? 1 : 0,
		// "go back to Portal" click
		// 1350 === 600*2 + 150: to wait for {springs} effects to finish then unmount the component
		delay: selectedSetting === null || showComponent ? 0 : 1350,
	})

	useEffect(() => {
		if (selectedSetting === null) {
			// none of the settings are clicked yet
			setShowComponent(false)
			return
		}

		const timer = setTimeout(() => setShowComponent(true), 2000) // 2000 > 1350

		return () => clearTimeout(timer)
	}, [selectedSetting])

	return (
		<Grid container direction="column" alignItems="center">
			{resizeListener}
			<Grid item>
				<img src={accountIcon} alt="settings page" />
			</Grid>
			<Grid item>
				<Typography
					align="center"
					variant="h4"
					classes={{ root: classes.name }}
				>
					Welcome back, {user.username}
				</Typography>
			</Grid>
			<Grid item>
				<Button onClick={handleLogout}>
					<Typography variant="h5" classes={{ root: classes.logout }}>
						logout
					</Typography>
				</Button>
			</Grid>
			<Grid
				item
				container
				classes={{ root: classes.dashboard }}
				alignItems="center"
				justifyContent="space-around"
				direction={matchesMD ? "column" : "row"}
			>
				{springs.map((prop, i) => {
					const button = buttons[i]

					return (
						<AnimatedGrid
							item
							key={i}
							onClick={() =>
								showComponent ? null : handleClick(button.label)
							}
							style={prop} // as defined from the useSprings()
							classes={{
								root: clsx(classes.button, {
									[classes.addHover]: !showComponent,
								}),
							}}
						>
							<AnimatedGrid
								style={styles}
								container
								direction="column"
								alignItems="center"
								justifyContent="center"
							>
								{selectedSetting === button.label &&
								showComponent ? (
									<button.component
										setSelectedSetting={setSelectedSetting}
									/>
								) : (
									<>
										<Grid item>
											<img
												src={button.icon}
												alt={button.label}
												className={classes.icon}
											/>
										</Grid>
										<Grid item>
											<Typography variant="h5">
												{button.label}
											</Typography>
										</Grid>
									</>
								)}
							</AnimatedGrid>
						</AnimatedGrid>
					)
				})}
			</Grid>
		</Grid>
	)
}
