"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
	async userSubscriptions(ctx) {
		let subscriptions = await strapi.services.subscription.find({
			user: ctx.state.user.id,
		});

		subscriptions.map((subscription) => {
			delete subscription.user; // redundant field
			sanitizeEntity(subscription, {
				model: strapi.models.subscription,
			});
		});

		ctx.send(subscriptions, 200);
	},

	async delete(ctx) {
		const { id } = ctx.params;

		const [subscription] = await strapi.services.subscription.find({
			id,
			user: ctx.state.user.id,
		});

		if (!subscription)
			return ctx.unauthorized("You can't update this entry.");

		const entity = await strapi.services.subscription.delete({ id });
		return sanitizeEntity(entity, { model: strapi.models.subscription });
	},
};
