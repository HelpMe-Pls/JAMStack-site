import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import { graphql } from "gatsby"

import Layout from "../components/ui/layout"
import DynamicToolbar from "../components/product-list/DynamicToolbar"
import ListOfProducts from "../components/product-list/ListOfProducts"

export const query = graphql`
	query GetCategorizedProducts($id: String!) {
		# $id is retrieved from the {pageContext}
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
						name
						url
					}
				}
			}
		}
	}
`

export default function ProductList({
	// nested destructuring:
	pageContext: { filterOptions, name, description },
	data: {
		// data.allStrapiProduct.nodes ==> data.allStrapiProduct.products
		allStrapiProduct: { nodes: products },
	},
}) {
	const [layout, setLayout] = useState("grid")

	return (
		<Layout>
			<Grid container direction="column" alignItems="center">
				<DynamicToolbar
					filterOptions={filterOptions}
					name={name}
					description={description}
					layout={layout}
					setLayout={setLayout}
				/>
				<ListOfProducts layout={layout} products={products} />
			</Grid>
		</Layout>
	)
}
