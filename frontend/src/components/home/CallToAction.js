import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
//import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"
import { Link } from "gatsby"

import cta from "../../images/cta.svg"

const useStyles = makeStyles(theme => ({
	account: {
		color: "#fff",
		marginLeft: "2rem",
	},
	body: {
		maxWidth: "45rem",
		[theme.breakpoints.down("md")]: {
			padding: "0 1rem",
		},
		[theme.breakpoints.down("xs")]: {
			padding: "0",
		},
	},
	container: {
		marginBottom: "15rem",
	},
	buttonContainer: {
		marginTop: "2rem",
	},
	// headingContainer: {
	// 	[theme.breakpoints.down("md")]: {
	// 		padding: "0 1rem",
	// 	},
	// 	[theme.breakpoints.down("xs")]: {
	// 		padding: "0",
	// 	},
	// },
	// icon: {
	// 	[theme.breakpoints.down("xs")]: {
	// 		height: "18rem",
	// 		width: "20rem",
	// 	},
	// },
}))

export default function CallToAction() {
	const classes = useStyles()
	//const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	return (
		<Grid
			container
			justifyContent="space-around"
			alignItems="center"
			classes={{ root: classes.container }}
		>
			<Grid item>
				<img
					src={cta}
					alt="quality-committed"
					className={classes.icon}
				/>
			</Grid>
			<Grid item>
				<Grid container direction="column">
					<Grid item>
						<Typography variant="h1">
							Committed to highest quality
						</Typography>
					</Grid>
					<Grid item classes={{ root: classes.body }}>
						<Typography variant="body1">
							At LOCO our mission is to provide comfortable,
							durable, premium, designer clothing and clothing
							accessories to developers and technology
							enthusiasts.
						</Typography>
					</Grid>
					<Grid
						item
						container
						classes={{ root: classes.buttonContainer }}
					>
						<Grid item>
							<Button
								variant="outlined"
								color="primary"
								component={Link}
								to="/contact"
							>
								Contact Us
							</Button>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								component={Link}
								to="/account"
								classes={{ root: classes.account }}
							>
								Create an Account
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
