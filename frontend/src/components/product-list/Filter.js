import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles } from "@material-ui/core/styles"

import filter from "../../images/filter.svg"
import close from "../../images/close-outline.svg"

const useStyles = makeStyles(theme => ({
	mainContainer: {
		padding: "1rem 0",
	},
	checkbox: {
		color: "#fff",
	},
	optionsContainer: {
		[theme.breakpoints.down("xs")]: {
			"& > :not(:last-child)": {
				marginBottom: "2rem",
			},
		},
	},
}))

export default function Filter({ setOption, filterOptions, setFilterOptions }) {
	const classes = useStyles()

	// e.g. we want to get the state of the Medium size:
	// filterOptions = {
	// 	Size : [
	// 		{ label: "S", checked: false },
	// 		{ label: "M", checked: true },
	// 		{ label: "L", checked: false },
	// 	]
	// 	Style: ...
	// }
	// filterOptions.Size[1].checked ==> generalized into: filterOptions.[option][i].checked

	const handleFilter = (option, i) => {
		const newFilter = { ...filterOptions } // state's immutability reason

		// to toggle the checkbox whenever the user clicks on it
		newFilter[option][i].checked = !newFilter[option][i].checked
		setFilterOptions(newFilter)
	}
	return (
		<Grid
			item
			container
			justifyContent="space-between"
			alignItems="center"
			classes={{ root: classes.mainContainer }}
		>
			<Grid item>
				<IconButton onClick={() => setOption(null)}>
					<img src={filter} alt="filter" />
				</IconButton>
			</Grid>
			<Grid item xs>
				<Grid
					container
					justifyContent="space-around"
					classes={{ root: classes.optionsContainer }}
				>
					{Object.keys(filterOptions)
						// e.g. hats don't have style ==> hats.style === null ==> don't display style option for hats
						.filter(option => filterOptions[option] !== null)
						.map(option => (
							<Grid item key={option}>
								<Grid container direction="column">
									<Grid item>
										<Chip label={option} />
									</Grid>
									<Grid item>
										<FormControl component="fieldset">
											<FormGroup>
												{filterOptions[option].map(
													({ label, checked }, i) => (
														<FormControlLabel
															key={label}
															label={label}
															classes={{
																label: classes.checkbox,
															}}
															control={
																<Checkbox
																	name={label}
																	checked={
																		checked
																	}
																	classes={{
																		root: classes.checkbox,
																	}}
																	onChange={() =>
																		handleFilter(
																			option,
																			i
																		)
																	}
																/>
															}
														></FormControlLabel>
													)
												)}
											</FormGroup>
										</FormControl>
									</Grid>
								</Grid>
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
