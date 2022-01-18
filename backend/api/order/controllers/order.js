"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

// Guest's creds:
// zhSarlO7JZXN4zAKjyBFW1x9ebt2c536
// ru#EQS69mYeN!@@dAU$Ch%DTf5PO

const { sanitizeEntity } = require("strapi-utils");
const GUEST_ID = "61e50e5e3ccbc84880b0ed54";

module.exports = {
	async place(ctx) {
		const {
			shippingAddress,
			billingAddress,
			shippingInfo,
			billingInfo,
			shippingOption,
			subtotal,
			tax,
			total,
			items,
		} = ctx.request.body;

		let orderCustomer;

		if (ctx.state.user) {
			orderCustomer = ctx.state.user.id;
		} else {
			// user is not logged in
			orderCustomer = GUEST_ID;
		}

		let serverTotal = 0;
		let unavailable = [];

		await Promise.all(
			// creates an isolated async-await block to validate & set the order
			items.map(async (clientItem) => {
				const serverItem = await strapi.services.variant.findOne({
					id: clientItem.variant.id,
				});

				if (serverItem.qty < clientItem.qty) {
					unavailable.push({
						id: serverItem.id,
						qty: serverItem.qty,
					});
				} else {
					await strapi.services.variant.update(
						{ id: clientItem.variant.id },
						{ qty: serverItem.qty - clientItem.qty }
					);
				}

				serverTotal += serverItem.price * clientItem.qty; // get {price} from server to make sure the order is legit (i.e. to make sure the {price} is not manipulated by the client)
			})
		);

		// from this point and on: only executed after everything in Promise.all() has completed SUCCESSFULLY
		const shippingOptions = [
			{ label: "FREE SHIPPING", price: 0 },
			{ label: "2-DAY SHIPPING", price: 6.99 },
			{ label: "OVERNIGHT SHIPPING", price: 69.96 },
		];

		const shippingValid = shippingOptions.find(
			// to make sure the {shippingOptions} is not manipulated by the client)
			(option) =>
				option.label === shippingOption.label &&
				option.price === shippingOption.price
		);

		if (
			shippingValid === undefined ||
			(serverTotal * 1.069 + shippingValid.price).toFixed(2) !== total
		) {
			ctx.send({ error: "Invalid Cart" }, 400);
		} else if (unavailable.length > 0) {
			ctx.send({ unavailable }, 409);
		} else {
			let order = await strapi.services.order.create({
				shippingAddress,
				billingAddress,
				shippingInfo,
				billingInfo,
				shippingOption,
				subtotal,
				tax,
				total,
				items,
				user: orderCustomer,
			});

			order = sanitizeEntity(order, { model: strapi.models.order });

			if (order.user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536") {
				order.user = { username: "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536" }; // set to that corresponding "Guest" to prevent leaking/sharing any of the other orders from other "Guest" checkouts
			}

			ctx.send({ order }, 200);
		}
	},
};
