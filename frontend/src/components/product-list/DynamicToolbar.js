import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
// import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

import FunctionContainer from "./FunctionContainer"
import DescriptionContainer from "./DescriptionContainer"

const useStyles = makeStyles(theme => ({
	toolbar: {
		width: "95%",
		height: "auto",
		marginBottom: "5rem",
	},
}))

export default function DynamicToolbar({
	filterOptions,
	name,
	description,
	layout,
	setLayout,
	setPage,
}) {
	const classes = useStyles()
	const [option, setOption] = useState(null)

	return (
		<Grid
			item
			container
			direction="column"
			classes={{ root: classes.toolbar }}
		>
			<FunctionContainer
				option={option}
				setOption={setOption}
				filterOptions={filterOptions}
			/>
			{option === null && (
				<DescriptionContainer
					layout={layout}
					setLayout={setLayout}
					name={name}
					description={description}
					setPage={setPage}
				/>
			)}
		</Grid>
	)
}
