import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { useQuery } from "@apollo/client"

import { useUser } from "../../contexts"

import ProductReview from "./ProductReview"

import { StyledPagination } from "../../templates/ProductList"

import { GET_REVIEWS } from "../../apollo/queries"

const useStyles = makeStyles(() => ({
	reviews: {
		padding: "0 3rem",
	},
	pagination: {
		marginBottom: "3rem",
	},
}))

export default function ProductReviews({ product, addReview, setAddReview }) {
	const classes = useStyles()
	const { user } = useUser()
	const [reviews, setReviews] = useState([])
	const [page, setPage] = useState(1)

	const { data } = useQuery(GET_REVIEWS, {
		variables: {
			id: product,
		},
	})

	useEffect(() => {
		if (data) {
			setReviews(data.product.reviews)
		}
	}, [data])

	const reviewsPerPage = 15
	const totalPages = Math.ceil(reviews.length / reviewsPerPage)

	return (
		<Grid
			id="reviews" // for handleAddReview() in ProductInfo.js
			item
			container
			direction="column"
			classes={{ root: classes.reviews }}
		>
			{addReview && (
				<ProductReview
					user={user} // to be served in ProductReview.js >> foundForEdit
					reviews={reviews}
					setReviews={setReviews}
					product={product}
					setAddReview={setAddReview}
				/>
			)}
			{reviews
				// so that when an user edit their review, we don't show the previous version of it in the list of reviews
				.filter(review =>
					addReview ? review.user.username !== user.username : review
				)
				// get the number of reviews to display on a page
				.slice((page - 1) * reviewsPerPage, page * reviewsPerPage)
				.map(review => (
					<ProductReview
						key={review.id}
						product={product}
						reviews={reviews}
						review={review}
					/>
				))}
			<Grid item container justifyContent="flex-end">
				<Grid item>
					<StyledPagination
						classes={{
							root: classes.pagination,
						}}
						count={totalPages}
						page={page}
						onChange={(_e, newPage) => setPage(newPage)}
						color="primary"
					/>
				</Grid>
			</Grid>
		</Grid>
	)
}
