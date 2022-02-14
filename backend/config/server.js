module.exports = ({ env }) => ({
	host: env("HOST", "0.0.0.0"),
	port: env.int("PORT", 1337),
	cron: { enabled: true },
	url: env("URL"),

	// Testing url for Facebook Auth:
	// url: env("", "https://acfa-171-250-73-212.ngrok.io"),

	admin: {
		auth: {
			secret: env("ADMIN_JWT_SECRET", "46ccbd288693d37d934469e558bf99e5"),
		},
	},
});
