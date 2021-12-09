import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import facebook from "../../images/facebook.svg"
import twitter from "../../images/twitter.svg"
import instagram from "../../images/instagram.svg"

const useStyles = makeStyles(theme => ({
	footer: {
		backgroundColor: theme.palette.primary.main,
		padding: "2rem",
	},
	linkColumn: {
		width: "25rem",
	},
	spacer: {
		marginTop: "0.85rem",
		marginBottom: "0.85rem",
	},
	link: {
		color: "#fff",
		fontSize: "1.25rem",
	},
	linkContainer: {
		[theme.breakpoints.down("md")]: {
			marginBottom: "3rem",
		},
	},
	icon: {
		"&:hover": {
			backgroundColor: "transparent",
		},
	},
	"@global": {
		body: {
			// to remove default <body> margin of the browser
			margin: 0,
		},
		a: {
			textDecoration: "none",
		},
	},
}))

export default function Footer() {
	const classes = useStyles()

	const socialMedia = [
		{ icon: facebook, alt: "facebook", link: "https://facebook.com/me" },
		{ icon: twitter, alt: "twitter", link: "https://twitter.com" },
		{ icon: instagram, alt: "instagram", link: "https://instagram.com" },
	]

	const routes = {
		// setting this structure as an array will make it harder to read & maping through, that's why we set it as an object
		"Contact Us": [
			// space between words of the key is unacceptable, that's why it has to be put as a string
			{ label: "(+84) 369 149 942", href: "tel:(+84) 369 149 942" },
			{
				label: "khoile5399@gmail.com",
				href: "mailto:khoile5399@gmail.com",
			},
		],
		"Customer Service": [
			{ label: "Contact Us", path: "/contact" },
			{ label: "My Account", path: "/account" },
		],
		Information: [
			{ label: "Privacy Policy", path: "/privacy-policy" },
			{ label: "Terms and Conditions", path: "/terms-conditions" },
		],
	}

	return (
		<footer className={classes.footer}>
			<Grid container justify="space-between">
				{/* for links */}
				<Grid item classes={{ root: classes.linkContainer }}>
					{/* {justify} only works for {item}, that's why we have to wrap the below {container} in this {item}*/}
					<Grid container>
						{Object.keys(routes).map((column, i) => (
							<Grid
								item
								key={i}
								container
								direction="column"
								classes={{ root: classes.linkColumn }}
							>
								<Grid item>
									<Typography variant="h5">
										{column}
									</Typography>
								</Grid>
								{routes[column].map(
									// routes[column] as the computed property of the object
									row => (
										<Grid item key={row.label}>
											<Typography
												component={
													row.path ? Link : "a"
												}
												to={
													row.path
														? row.path
														: undefined // so that it only renders the link if it has a path
												}
												href={
													row.href
														? row.href
														: undefined
												}
												variant="body1"
												classes={{
													body1: classes.link,
												}}
											>
												{row.label}
											</Typography>
										</Grid>
									)
								)}
							</Grid>
						))}
					</Grid>
				</Grid>

				{/* for social media */}
				<Grid item>
					<Grid container item direction="column" alignItems="center">
						{socialMedia.map(platform => (
							<Grid item key={platform.alt}>
								<IconButton
									//onClick={() => window.open(platform.link)}
									classes={{ root: classes.icon }}
									component="a"
									disableRipple
									href={platform.link}
									target="_blank"
									rel="noreferrer noopener"
								>
									<img
										src={platform.icon}
										alt={platform.alt}
									/>
								</IconButton>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</footer>
	)
}