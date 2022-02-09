import React from "react"
import Select from "@material-ui/core/Select"
import Chip from "@material-ui/core/Chip"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
	chipRoot: {
		backgroundColor: "#fff",
		height: "3rem",
		borderRadius: 50,
		"&:hover": {
			cursor: "pointer",
		},
	},
	chipLabel: {
		color: theme.palette.secondary.main,
	},
	select: {
		"&.MuiSelect-select": {
			paddingRight: 0,
		},
	},
	menu: {
		backgroundColor: theme.palette.primary.main,
	},
	menuItem: {
		color: "#fff",
	},
}))

export default function SelectFrequency({
	chip, // to pass in customized <Chip/>
	value,
	setValue,
}) {
	const classes = useStyles()

	const frequencies = [
		"Week",
		"Two Weeks",
		"Month",
		"Three Months",
		"Six Months",
		"Year",
	]

	return (
		<Select
			classes={{ select: classes.select }} // explanation in lecture 424 @8:34
			value={value}
			disableUnderline
			IconComponent={() => null} // get rid of the default dropdown icon
			MenuProps={{ classes: { paper: classes.menu } }}
			onChange={event => setValue(event.target.value)}
			renderValue={
				// to render the selected frequency as a <Chip/>
				selected =>
					chip || (
						<Chip
							label={selected}
							classes={{
								root: classes.chipRoot,
								label: classes.chipLabel,
							}}
						/>
					)
			}
		>
			{
				// after we clicked on the Chip
				frequencies.map(frequency => (
					<MenuItem
						classes={{ root: classes.menuItem }}
						key={frequency}
						value={frequency}
					>
						{frequency}
					</MenuItem>
				))
			}
		</Select>
	)
}
