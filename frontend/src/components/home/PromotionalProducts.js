import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function PromotionalProducts() {
	const data = useStaticQuery(graphql`
		query GetPromos {
			allStrapiProduct(filter: { promo: { eq: true } }) {
				nodes {
					name
					strapiId
					description
					variants {
						images {
							url
						}
					}
				}
			}
		}
	`)
	console.log(data)
	return <div>Promo Products</div>
}
