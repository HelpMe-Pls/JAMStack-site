import React from "react"
import Grid from "@material-ui/core/Grid"
//import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"

import filter from "../../images/filter.svg"
import sort from "../../images/sort.svg"

import Sort from "./Sort"
import Filter from "./Filter"

const useStyles = makeStyles(theme => ({
	functionContainer: {
		backgroundColor: theme.palette.primary.main,
		minHeight: "6rem",
		height: "auto", //extends as far as it needs to cover up the checkboxes
		borderRadius: (
			{ option } // conditionally applies style based on the component's props (passed in as useStyles's param)
		) => (option !== null ? "25px" : "25px 25px 0px 0px"),
	},
}))

export default function FunctionContainer({
	filterOptions,
	option, // lifted state to be passed down to from its parent <DynamicToolbar>
	setOption,
}) {
	const classes = useStyles({ option }) // same as useStyles({ option:option }) with the latter is the component's prop,
	// and the former is the actual prop that you'll use in makeStyles()

	const content = () => {
		switch (option) {
			case "sort":
				return <Sort setOption={setOption} />
			case "filter":
				return (
					<Filter
						setOption={setOption}
						filterOptions={filterOptions}
					/>
				)
			default:
				const items = [
					{ icon: filter, alt: "filter" },
					{ icon: sort, alt: "sort" },
				]
				return (
					<Grid
						item
						container
						justifyContent="space-around"
						alignItems="center"
					>
						{items.map(item => (
							<Grid item key={item.alt}>
								<IconButton onClick={() => setOption(item.alt)}>
									<img src={item.icon} alt={item.alt} />
								</IconButton>
							</Grid>
						))}
					</Grid>
				)
		}
	}

	return (
		<Grid item container classes={{ root: classes.functionContainer }}>
			{content()}
		</Grid>
	)
}
