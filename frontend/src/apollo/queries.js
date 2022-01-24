import { gql } from "@apollo/client"

// Run-time queries
// i.e. get those queries whenever there's a corresponding request from the page
export const GET_DETAILS = gql`
	query getDetails($id: ID!) {
		product(id: $id) {
			rating
			variants {
				qty
			}
		}
	}
`
export const GET_REVIEWS = gql`
	query getReviews($id: ID!) {
		product(id: $id) {
			reviews {
				id
				text
				rating
				updatedAt
				user {
					username
				}
			}
		}
	}
`
