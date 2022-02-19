import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import sort from "../../images/sort.svg"
import close from "../../images/close-outline.svg"

const useStyles = makeStyles(theme => ({
	chipContainer: {
		[theme.breakpoints.down("md")]: {
			margin: "0.5rem",
		},
	},
	notActive: {
		backgroundColor: theme.palette.primary.main,
	},
}))

export default function Sort({ setOption, sortOptions, setSortOptions }) {
	const classes = useStyles()
	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const handleSort = i => {
		const newOptions = [...sortOptions] // for immutability reason

		// so that when we click on an option, the rest the them are de-selected
		newOptions.map(option => (option.active = false))

		// setting the clicked option to "active".
		newOptions[i].active = true
		setSortOptions(newOptions)
	}

	return (
		<Grid item container justifyContent="space-between" alignItems="center">
			<Grid item>
				<IconButton onClick={() => setOption(null)}>
					<img src={sort} alt="sort" />
				</IconButton>
			</Grid>
			<Grid item xs>
				<Grid
					container
					justifyContent="space-around"
					alignItems={matchesXS ? "center" : undefined}
					direction={matchesXS ? "column" : "row"}
				>
					{sortOptions.map((option, i) => (
						<Grid
							item
							key={option.label}
							classes={{ root: classes.chipContainer }}
						>
							<Chip
								label={option.label}
								onClick={() => handleSort(i)}
								color={
									option.active !== true
										? "primary"
										: "secondary"
								}
								classes={{
									root: clsx({
										[classes.notActive]:
											option.active !== true,
									}),
								}}
							/>
						</Grid>
					))}
				</Grid>
			</Grid>
			<Grid item>
				<IconButton onClick={() => setOption(null)}>
					<img src={close} alt="close" />
				</IconButton>
			</Grid>
		</Grid>
	)
}
