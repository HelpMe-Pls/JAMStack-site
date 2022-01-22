import React, { useEffect, useState } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Chip from "@material-ui/core/Chip"
import IconButton from "@material-ui/core/IconButton"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"

import OrderDetails from "./OrderDetails"

import BackwardsIcon from "../../images/BackwardsOutline"
import detailsIcon from "../../images/details.svg"

import { useUser } from "../../contexts"

const useStyles = makeStyles(theme => ({
	item: {
		height: "100%",
		width: "100%",
	},
	chipLabel: {
		fontWeight: 600,
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
		//TODO: convert to JSS
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
			"white-space": "pre-wrap",
			"max-height": "100% !important",
			"line-height": "initial !important",
			padding: "1rem",
			"padding-right": "calc(1rem + 26px)", // to take the Title's dropdown button into account
			display: "flex",
			"align-items": "center",
			justifyContent: "center",
			"font-weight": 600,
			"border-bottom": "2px solid #fff",
		},
		".MuiDataGrid-root .MuiDataGrid-row": {
			"max-height": "100% !important",
		},
		".MuiDataGrid-root .MuiDataGrid-footer": {
			"margin-top": "-8.069rem",
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

export default function OrderHistory({ setSelectedSetting }) {
	const classes = useStyles()
	const [orders, setOrders] = useState([])
	const [open, setOpen] = useState(null)
	const { user } = useUser()

	useEffect(() => {
		axios
			.get(process.env.GATSBY_STRAPI_URL + "/orders/history", {
				headers: { Authorization: `Bearer ${user.jwt}` },
			})
			.then(response => {
				setOrders(response.data.orders)
			})
			.catch(error => {
				console.error(error)
			})
	}, [])

	const createData = data =>
		data.map(item => ({
			shipping: `${item.shippingInfo.name}\n${item.shippingAddress.street}\n${item.shippingAddress.city}, ${item.shippingAddress.state} ${item.shippingAddress.zip}`,
			order: `#${item.id
				.slice(item.id.length - 10, item.id.length)
				.toUpperCase()}`,
			status: item.status,
			date: `${item.createdAt.split("-")[2].split("T")[0]}/${
				item.createdAt.split("-")[1]
			}/${item.createdAt.split("-")[0]}`, // dd/mm/yyyy
			total: item.total,
			id: item.id,
		}))

	const columns = [
		{
			field: "shipping",
			headerName: "Shipping Address",
			width: 320,
			sortable: false,
		},
		{ field: "order", headerName: "Order", width: 250 },
		{
			field: "status",
			headerName: "Status",
			width: 250,
			renderCell: ({ value }) => (
				<Chip label={value} classes={{ label: classes.chipLabel }} />
			),
		},
		{ field: "date", headerName: "Date", width: 250, type: "date" },
		{
			field: "total",
			headerName: "Total",
			width: 250,
			renderCell: ({ value }) => (
				<Chip
					label={`$${value}`}
					classes={{ label: classes.chipLabel }}
				/>
			),
		},
		{
			field: "",
			width: 350,
			sortable: false,
			renderCell: () => (
				<IconButton>
					<img src={detailsIcon} alt="order details" />
				</IconButton>
			),
		},
	]

	const rows = createData(orders)

	return (
		<Grid item container classes={{ root: classes.item }}>
			<Grid item classes={{ root: classes.header }}>
				<IconButton onClick={() => setSelectedSetting(null)}>
					<div className={classes.icon}>
						<BackwardsIcon color="#fff" />
					</div>
				</IconButton>
			</Grid>
			<DataGrid
				hideFooterSelectedRowCount
				onRowClick={event => setOpen(event.row.id)}
				rows={rows}
				columns={columns}
				pageSize={5}
			/>
			<OrderDetails open={open} setOpen={setOpen} orders={orders} />
		</Grid>
	)
}
