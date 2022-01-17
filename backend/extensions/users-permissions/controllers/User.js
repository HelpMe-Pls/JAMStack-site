const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
	sanitizeEntity(user, {
		model: strapi.query("user", "users-permissions").model,
	});

module.exports = {
	async setSettings(ctx) {
		const { id, contactInfo, locations } = ctx.state.user;
		const { details, detailSlot, location, locationSlot } =
			ctx.request.body;

		let newInfo = [...contactInfo];
		let newLocations = [...locations];

		// <typeof> returns a string
		if (
			typeof details !== "undefined" &&
			typeof detailSlot !== "undefined"
		) {
			newInfo[detailSlot] = details;
		} else if (
			// for delete request
			typeof details === "undefined" &&
			typeof detailSlot !== "undefined"
		) {
			newInfo[detailSlot] = { name: "", email: "", phone: "" };
		}

		if (
			typeof location !== "undefined" &&
			typeof locationSlot !== "undefined"
		) {
			newLocations[locationSlot] = location;
		} else if (
			typeof location === "undefined" &&
			typeof locationSlot !== "undefined"
		) {
			newLocations[locationSlot] = {
				street: "",
				zip: "",
				city: "",
				state: "",
			};
		}

		// this is where the database actually updates the new info
		let newUser = await strapi.plugins[
			"users-permissions"
		].services.user.edit(
			{ id },
			{ contactInfo: newInfo, locations: newLocations }
		);

		newUser = sanitizeUser(newUser); // so that we don't send sensitive/private data to the client

		ctx.send(newUser, 200); // send updated user profile back to the client
	},

	async changePassword(ctx) {
		const { id } = ctx.state.user;
		const { password } = ctx.request.body;

		await strapi.plugins["users-permissions"].services.user.edit(
			{ id }, // to make sure that it's the correct user who's changing their password
			{ password }
		);

		ctx.send("Password Successfully Changed", 200); // the {password} is not attached to the user's profile so we don't need to include it in the send()
	},

	// async me(ctx) {
	// 	const user = ctx.state.user;

	// 	if (!user) {
	// 		return ctx.badRequest(null, [
	// 			{ messages: [{ id: "No authorization header was found" }] },
	// 		]);
	// 	}

	// 	let newUser = { ...sanitizeUser(user) };
	// 	const favorites = await strapi.services.favorite.find({ user });
	// 	const subscriptions = await strapi.services.subscription.find({ user });
	// 	newUser.favorites = favorites.map((favorite) => ({
	// 		variant: favorite.variant.id,
	// 		id: favorite.id,
	// 	}));
	// 	newUser.subscriptions = subscriptions.map((subscription) => {
	// 		delete subscription.user;
	// 		return subscription;
	// 	});

	// 	ctx.body = newUser;
	// },
};
