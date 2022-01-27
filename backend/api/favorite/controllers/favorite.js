"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
	async create(ctx) {
		let entity;
		if (ctx.is("multipart")) {
			const { data, files } = parseMultipartData(ctx);
			data.user = ctx.state.user.id;
			entity = await strapi.services.favorite.create(data, { files });
		} else {
			ctx.request.body.user = ctx.state.user.id;
			entity = await strapi.services.favorite.create(ctx.request.body);
		}
		return sanitizeEntity(entity, { model: strapi.models.favorite });
	},

	async delete(ctx) {
		const { id } = ctx.params;

		// Array destructuring:
		// Instead of: const favFromDb = await....
		// then if you want to access it you'll have to favFromDb.favorite (which is inappropriate coz strapi.services.favorite returns an array), therefore you'll have to get is as favFromDb[favorite], and destructuring that will get us:
		const [favorite] = await strapi.services.favorite.find({
			id,
			user: ctx.state.user.id,
		});

		if (!favorite) return ctx.unauthorized("You can't update this entry.");

		const entity = await strapi.services.favorite.delete({ id });
		return sanitizeEntity(entity, { model: strapi.models.favorite });
	},

	async userFavorites(ctx) {
		let favorites = await strapi.services.favorite.find({
			user: ctx.state.user.id,
		});

		await Promise.all(
			// get ALL variants of the corresponding product so we can access the full list of styles, sizes,...
			favorites.map(async (favorite, i) => {
				const variants = await strapi.services.variant.find({
					product: favorite.variant.product,
				});

				variants.forEach((variant) => {
					delete variant.created_by;
					delete variant.updated_by;
				});

				// add a new field called "variants" to each {favorite}
				favorites[i].variants = variants;
				delete favorites[i].user;
				delete favorites[i].updated_by;
				delete favorites[i].created_by;
			})
		);

		ctx.send(favorites, 200);
	},
};
