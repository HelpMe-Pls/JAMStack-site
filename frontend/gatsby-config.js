require("dotenv").config()

module.exports = {
	siteMetadata: {
		title: `LOCO`,
		description: `The premier developer clothing line. For developers, by developers. High quality, custom-designed shirts, hats, and hoodies. Just a project to put in my CV though.`,
		author: `Khoi Le`,
		keywords: [
			"clothing",
			"developer",
			"programmer",
			"coding",
			"code",
			"websites",
			"web developer",
			"hats",
			"shirts",
			"hoodies",
		],
		siteUrl: "https://locostore.netlify.app",
		twitterUsername: "@RandomG37891697",
		defaultImage: "",
	},
	plugins: [
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-material-ui",
		`gatsby-plugin-sitemap`,
		`gatsby-plugin-image`,
		{
			resolve: `gatsby-plugin-robots-txt`,
			options: {
				host: "https://locostore.netlify.app",
				sitemap: "https://locostore.netlify.app/sitemap.xml",
				policy: [{ userAgent: "*", allow: "/" }],
			},
		},
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
		{
			resolve: `gatsby-plugin-sharp`,
			options: {
				defaults: {
					formats: [`auto`, `webp`],
					placeholder: "blurred",
					breakpoints: [300, 600, 960, 1280, 1920],
				},
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: "LOCO-store",
				short_name: "LOCO",
				start_url: "/",
				background_color: "#7FB2F0",
				theme_color: "#7FB2F0",
				display: "minimal-ui",
				icon: "src/images/logo192.png", // This path is relative to the root of the site.
			},
		},
		"gatsby-plugin-offline", // PWAs stuff and reduce bandwidth usage for AWS-S3 by caching image requests
	],
}
