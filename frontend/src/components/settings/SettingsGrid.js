import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"

import BackwardsIcon from "../../images/BackwardsOutline"

const useStyles = makeStyles(theme => ({
	container: {
		height: "100%",
		width: "100%",
	},
	header: {
		height: "5rem",
		width: "100%",
		backgroundColor: theme.palette.secondary.main,
	},
	icon: {
		height: "4rem",
		width: "4rem",
	},
	"@global": {
		".MuiDataGrid-root .MuiDataGrid-colCellTitle": {
			fontWeight: 600,
		},
		".MuiDataGrid-root .MuiDataGrid-columnSeparator": {
			display: "none",
		},
		".MuiDataGrid-root .MuiDataGrid-colCellTitleContainer": {
			justifyContent: "center",
		},
		".MuiDataGrid-root .MuiDataGrid-colCellMoving": {
			backgroundColor: "transparent",
		},
		".MuiDataGrid-root .MuiDataGrid-cell": {
			whiteSpace: "pre-wrap",
			maxHeight: "100% !important",
			lineHeight: "initial !important",
			padding: "1rem",
			paddingRight: "calc(1rem + 26px)", // to take the Title's dropdown button into account
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontWeight: 600,
			borderBottom: "2px solid #fff",
		},
		".MuiDataGrid-root .MuiDataGrid-row": {
			maxHeight: "100% !important",
		},
		".MuiDataGrid-root .MuiDataGrid-footer": {
			marginTop: "-8.069rem",
		},
		".MuiTablePagination-caption": {
			color: "#fff",
		},
		".MuiSvgIcon-root": {
			fill: "#fff",
		},
		".MuiDataGrid-root .MuiDataGrid-columnsContainer": {
			"background-color": theme.palette.secondary.main,
			border: "none",
		},
		".MuiDataGrid-root": {
			border: "none",
		},
		".MuiDataGrid-root .MuiDataGrid-overlay": {
			bottom: "5rem",
		},
	},
}))

export default function SettingsGrid({
	setSelectedSetting,
	rows,
	columns,
	setOpen,
	rowsPerPage,
}) {
	const classes = useStyles()

	return (
		<Grid item container classes={{ root: classes.container }}>
			<Grid item classes={{ root: classes.header }}>
				<IconButton onClick={() => setSelectedSetting(null)}>
					<div className={classes.icon}>
						<BackwardsIcon color="#fff" />
					</div>
				</IconButton>
			</Grid>
			<DataGrid
				hideFooterSelectedRowCount
				onRowClick={event => (setOpen ? setOpen(event.row.id) : null)}
				rows={rows}
				columns={columns}
				pageSize={rowsPerPage || 5}
			/>
		</Grid>
	)
}
