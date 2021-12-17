import * as React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Link } from "gatsby"

import address from "../images/address.svg"
import phone from "../images/phone-adornment.svg"
import Email from "../images/EmailAdornment.js"
import send from "../images/send.svg"

import Layout from "../components/ui/layout"

const useStyles = makeStyles(theme => ({
	mainContainer: {
		height: "35rem",
		backgroundColor: theme.palette.primary.main,
		margin: "10rem 0",
		[theme.breakpoints.down("md")]: {
			marginTop: "8rem",
			height: "90rem",
		},
	},
	formWrapper: {
		height: "100%",
		// [theme.breakpoints.down("md")]: {
		//   height: "50%",
		//   marginTop: "-8rem",
		// },
		// [theme.breakpoints.down("xs")]: {
		//   width: "100%",
		// },
	},
	formContainer: {
		height: "100%",
	},
	blockContainer: {
		backgroundColor: theme.palette.secondary.main,
		height: "8rem",
		width: "40rem",
		// apply flex layout for the "Contact Us" and "send message"
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// [theme.breakpoints.down("sm")]: {
		//   width: "30rem",
		// },
		// [theme.breakpoints.down("xs")]: {
		//   width: "100%",
		// },
	},
	titleContainer: {
		marginTop: "-4rem",
	},
	buttonContainer: {
		marginBottom: "-4rem",
		textTransform: "none",
		borderRadius: 0,
		"&:hover": {
			backgroundColor: theme.palette.secondary.dark,
		},
	},
	sendIcon: {
		marginLeft: "2rem",
	},
	contactInfo: {
		fontSize: "1.5rem",
		marginLeft: "1rem",
	},
	contactIcon: {
		height: "3rem",
		width: "3rem",
	},
	contactEmailIcon: {
		height: "2.25rem",
		width: "3rem",
	},
	infoContainer: {
		height: "21.25rem",
		[theme.breakpoints.down("xs")]: {
			height: "15.25rem",
		},
	},
	middleInfo: {
		borderTop: "2px solid #fff",
		borderBottom: "2px solid #fff",
	},
	iconContainer: {
		borderRight: "2px solid #fff",
		height: "7rem",
		width: "8rem",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// [theme.breakpoints.down("xs")]: {
		//   height: "5rem",
		//   width: "6rem",
		// },
	},
}))

const ContactPage = () => {
	const classes = useStyles()
	//const theme = useTheme()

	// const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
	// const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	return (
		<Layout>
			<Grid
				container
				justifyContent="space-around"
				alignItems="center"
				classes={{ root: classes.mainContainer }}
			>
				{/* Contact form */}
				<Grid item classes={{ root: classes.formWrapper }}>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						alignItems="center"
						className={classes.formContainer}
					>
						<Grid
							item
							classes={{
								root: clsx(
									classes.titleContainer,
									classes.blockContainer
								),
							}}
						>
							<Typography variant="h4">Contact Us</Typography>
						</Grid>
						<Grid
							item
							component={Button}
							classes={{
								root: clsx(
									classes.buttonContainer,
									classes.blockContainer
								),
							}}
						>
							<Typography variant="h4">Send message</Typography>
							<img
								src={send}
								className={classes.sendIcon}
								alt="send message"
							/>
						</Grid>
					</Grid>
				</Grid>

				{/* Contact info */}
				<Grid item>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						classes={{ root: classes.infoContainer }}
					>
						<Grid item container alignItems="center">
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								<img
									src={address}
									className={classes.contactIcon}
									alt="address"
								/>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									6996 Random Street, RS 699669
								</Typography>
							</Grid>
						</Grid>
						<Grid
							item
							container
							alignItems="center"
							classes={{ root: classes.middleInfo }}
						>
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								<img
									src={phone}
									className={classes.contactIcon}
									alt="phone"
								/>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									(+84) 369 149 942
								</Typography>
							</Grid>
						</Grid>
						<Grid item container alignItems="center">
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								<div className={classes.contactEmailIcon}>
									<Email color="#fff" />
								</div>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									khoile5399@gmail.com
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Layout>
	)
}

export default ContactPage
