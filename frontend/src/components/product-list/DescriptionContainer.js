import React from "react"
import clsx from "clsx"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { makeStyles } from "@material-ui/core/styles"

import background from "../../images/repeating-smallest.svg"
import ListIcon from "../../images/List"
import GridIcon from "../../images/Grid"

const useStyles = makeStyles(theme => ({
	description: {
		color: "#fff",
	},
	descriptionContainer: {
		backgroundColor: theme.palette.primary.main,
		height: "15rem",
		width: "60%", // % that its size is based on the screen size
		borderRadius: 25,
		padding: "1rem",
		[theme.breakpoints.down("md")]: {
			width: "100%",
		},
		[theme.breakpoints.down("sm")]: {
			borderRadius: 0,
			height: "18rem",
		},
	},
	mainContainer: {
		border: `5px solid ${theme.palette.primary.main}`,
		borderRadius: "0px 0px 25px 25px",
		padding: "3rem",
		backgroundImage: `url(${background})`,
		backgroundSize: "auto",
		backgroundPosition: "center",
		backgroundRepeat: "repeat",
		position: "relative", // so that it keeps the <ButtonGroup> within its border
		[theme.breakpoints.down("sm")]: {
			padding: "3rem 0",
		},
	},
	button: {
		border: `2px solid ${theme.palette.primary.main}`,
		borderRightColor: `${theme.palette.primary.main} !important`, // to fix crooked border
		borderRadius: 25,
		backgroundColor: "#fff",
		padding: "0.5rem 1.5rem",
		"&:hover": {
			backgroundColor: "#fff",
		},
	},
	selected: {
		backgroundColor: theme.palette.primary.main,
		"&:hover": {
			backgroundColor: theme.palette.primary.light,
		},
	},
	buttonGroup: {
		position: "absolute", // so that its appearance will be ignored, avoiding pushing the description off of its position just because the <ButtonGroup> is there
		right: 0,
		bottom: 0,
		marginRight: "3rem",
		marginBottom: "3rem",
		[theme.breakpoints.down("md")]: {
			position: "relative",
			display: "flex",
			alignSelf: "flex-end",
			marginRight: 0,
			marginBottom: 0,
			marginTop: "3rem",
		},
		[theme.breakpoints.down("sm")]: {
			position: "relative",
			display: "flex",
			alignSelf: "center",
		},
	},
}))

export default function DescriptionContainer({
	name,
	description,
	layout,
	setLayout,
}) {
	const classes = useStyles()
	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

	const changeLayout = option => {
		setLayout(option)
	}

	return (
		<Grid
			item
			container
			direction={matchesMD ? "column" : "row"}
			alignItems={matchesMD ? "center" : undefined}
			justifyContent="center"
			classes={{ root: classes.mainContainer }}
		>
			<Grid item classes={{ root: classes.descriptionContainer }}>
				<Typography align="center" variant="h4">
					{name}
				</Typography>
				<Typography
					align="center"
					variant="body1"
					classes={{ root: classes.description }}
				>
					{description}
				</Typography>
			</Grid>
			<Grid item classes={{ root: classes.buttonGroup }}>
				<ButtonGroup>
					<Button
						onClick={() => changeLayout("list")}
						classes={{
							outlined: clsx(classes.button, {
								[classes.selected]: layout === "list",
							}),
						}}
					>
						<ListIcon
							color={layout === "list" ? "#fff" : undefined}
						/>
					</Button>
					<Button
						onClick={() => changeLayout("grid")}
						classes={{
							outlined: clsx(classes.button, {
								[classes.selected]: layout === "grid",
							}),
						}}
					>
						<GridIcon
							color={layout === "grid" ? "#fff" : undefined}
						/>
					</Button>
				</ButtonGroup>
			</Grid>
		</Grid>
	)
}
