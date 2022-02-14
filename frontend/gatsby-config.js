require("dotenv").config()

module.exports = {
	siteMetadata: {
		title: "My super blog",
		description: "Gatsby blog with Strapi",
		author: "Strapi team",
	},
	plugins: [
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-material-ui",
		{
			resolve: "gatsby-plugin-web-font-loader",
			options: {
				google: {
					families: [
						"Philosopher:700:latin",
						"Montserrat:700,600,500,400,300:latin",
					],
				},
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: "gatsby-source-strapi",
			options: {
				// so that it'll use the corresponding strapi URL for dev || prod
				apiURL: process.env.GATSBY_STRAPI_URL,
				collectionTypes: [
					// List of the Content Types you want to be able to request from Gatsby.
					"product",
					"category",
					"variant",
				],
				queryLimit: 1000,
			},
		},
		"gatsby-transformer-sharp",
		"gatsby-plugin-sharp",
		// {
		// 	resolve: `gatsby-plugin-manifest`,
		// 	options: {
		// 		name: "gatsby-starter-default",
		// 		short_name: "starter",
		// 		start_url: "/",
		// 		background_color: "#663399",
		// 		theme_color: "#663399",
		// 		display: "minimal-ui",
		// 		icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
		// 	},
		// },
		"gatsby-plugin-offline",
	],
}
