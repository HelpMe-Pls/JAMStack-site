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

	async update(ctx) {
		const { id } = ctx.params;

		let entity;

		// same thing from the "review.js", only difference is the syntax
		const subscription = await strapi.services.subscription.find({
			id,
			user: ctx.state.user.id,
		});

		if (!subscription) {
			return ctx.unauthorized(
				"You're NOT permitted to update this entry"
			);
		}

		if (ctx.is("multipart")) {
			const { data, files } = parseMultipartData(ctx);
			entity = await strapi.services.subscription.update({ id }, data, {
				files,
			});
		} else {
			entity = await strapi.services.subscription.update(
				{ id },
				ctx.request.body
			);
		}

		await strapi.services.subscription.average(entity.product.id);
		return sanitizeEntity(entity, { model: strapi.models.subscription });
	},

	async delete(ctx) {
		const { id } = ctx.params;

		const subscription = await strapi.services.subscription.find({
			id,
			user: ctx.state.user.id,
		});

		if (!subscription)
			return ctx.unauthorized(
				"You're NOT permitted to delete this entry"
			);

		const entity = await strapi.services.subscription.delete({ id });
		return sanitizeEntity(entity, { model: strapi.models.subscription });
	},
};
