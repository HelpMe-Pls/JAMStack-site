import * as React from "react"
import Grid from "@material-ui/core/Grid"
import { graphql } from "gatsby"

import Layout from "../components/ui/layout"
import DynamicToolbar from "../components/product-list/DynamicToolbar"

export const query = graphql`
	query GetCategorizedProducts($id: String!) {
		# $id is retrieved from the pageContext
		allStrapiProduct(filter: { category: { id: { eq: $id } } }) {
			nodes {
				name
				strapiId
				variants {
					id
					color
					price
					size
					style
					images {
						url
					}
				}
			}
		}
	}
`

export default function ProductList({
	pageContext: { filterOptions, name, description }, // nested destructuring
}) {
	return (
		<Layout>
			<Grid container direction="column" alignItems="center">
				<DynamicToolbar
					filterOptions={filterOptions}
					name={name}
					description={description}
				/>
			</Grid>
		</Layout>
	)
}
