exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions

	const result = await graphql(`
		query GetProductsAndCategories {
			products: allStrapiProduct {
				nodes {
					name
					strapiId
					description
					category {
						name
					}
					variants {
						id
						color
						size
						style
						price
						images {
							localFile {
								childImageSharp {
									gatsbyImageData
								}
							}
						}
					}
				}
			}
			categories: allStrapiCategory {
				nodes {
					name
					strapiId
					description
					filterOptions {
						Size {
							checked
							label
						}
						Style {
							checked
							label
						}
						Color {
							checked
							label
						}
					}
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
			path: `/${product.category.name.toLowerCase()}/${
				product.name.split(" ")[0]
			}`,
			component: require.resolve("./src/templates/ProductDetail.js"),
			context: {
				name: product.name,
				id: product.strapiId,
				category: product.category.name,
				description: product.description,
				variants: product.variants,
				product: product,
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
				filterOptions: category.filterOptions,
			},
		})
	})
}

// To ignore the "react-spring-3d-carousel" on "build" command to avoid undefined "window" error from it
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
	if (stage === "build-html") {
		actions.setWebpackConfig({
			module: {
				rules: [
					{ test: /react-spring-3d-carousel/, use: loaders.null() },
				],
			},
		})
	}
}
