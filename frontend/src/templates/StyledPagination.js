import React from "react"
import Pagination from "@material-ui/lab/Pagination"
import PaginationItem from "@material-ui/lab/PaginationItem"
import { styled } from "@material-ui/core/styles"

export const StyledPagination = props => {
	// closure
	const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
		fontFamily: "Montserrat",
		fontSize: "2rem",
		color: theme.palette.primary.main,
		"&.Mui-selected": {
			color: "#fff",
		},
	}))

	return (
		<Pagination
			{...props}
			renderItem={item => <StyledPaginationItem {...item} />}
		/>
	)
}
