import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
//import IconButton from "@material-ui/core/IconButton"
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
	"@global": {
		body: {
			// to remove default <body> margin of the browser
			margin: 0,
		},
	},
}))

export default function Footer() {
	const classes = useStyles()

	return (
		<footer className={classes.footer}>
			<Grid container justify="space-between">
				{/* for links */}

				<Grid item classes={{ root: classes.linkContainer }}>
					{/* {justify} only works for {item}, that's why we have to wrap the below {container} in this {item}*/}
					<Grid container>
						<Grid
							container // inherit the width of the parent (100%)
							item
							direction="column"
							classes={{ root: classes.linkColumn }} // so that's why we have explicitly set the width of each child container
						>
							<Grid item>
								<Typography variant="h5">Contact Us</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }} // https://mui.com/api/typography/#css
								>
									randommail@gmail.com
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }}
								>
									(696) 669-9669
								</Typography>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="column"
							classes={{ root: classes.linkColumn }}
						>
							<Grid item>
								<Typography variant="h5">
									Customer Service
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }}
								>
									Contact Us
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }}
								>
									My Account
								</Typography>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="column"
							classes={{ root: classes.linkColumn }}
						>
							<Grid item>
								<Typography variant="h5">
									Information
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }}
								>
									Privacy Policy
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body1"
									classes={{ body1: classes.link }}
								>
									Terms & Conditions
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				{/* for social media */}
				<Grid item>
					<Grid container item direction="column" alignItems="center">
						<Grid item>
							<img src={facebook} alt="facebook" />
						</Grid>
						<Grid item classes={{ root: classes.spacer }}>
							<img src={twitter} alt="twitter" />
						</Grid>
						<Grid item>
							<img src={instagram} alt="instagram" />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</footer>
	)
}
