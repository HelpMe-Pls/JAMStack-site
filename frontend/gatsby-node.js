exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	const result = await graphql(`
		query GetProductsAndCategories {
			products: allStrapiProduct {
				nodes {
					name
					strapiId
					category {
						name
					}
				}
			}
			categories: allStrapiCategory {
				nodes {
					name
					strapiId
					description
				}
			}
		}
	`)

	if (result.errors) {
		throw result.errors
	}

	const products = result.data.products.nodes
	const categories = result.data.categories.nodes

	products.forEach(product => {
		createPage({
			path: `/${product.category.name.toLowerCase()}/${encodeURIComponent(
				product.name.split(" ")[0]
			)}`,
			component: require.resolve("./src/templates/ProductDetail.js"),
			context: {
				name: product.name,
				id: product.strapiId,
				category: product.category.name,
			},
		})
	})

	categories.forEach(category => {
		createPage({
			path: `/${category.name.toLowerCase()}`,
			component: require.resolve("./src/templates/ProductList.js"),
			context: {
				name: category.name,
				id: category.strapiId,
				description: category.description,
			},
		})
	})
}
