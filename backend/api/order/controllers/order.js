"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

// Guest's creds:
// zhSarlO7JZXN4zAKjyBFW1x9ebt2c536
// ru#EQS69mYeN!@@dAU$Ch%DTf5PO

const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SK);
const GUEST_ID = "61e50e5e3ccbc84880b0ed54";

const sanitizeUser = (user) =>
	sanitizeEntity(user, {
		model: strapi.query("user", "users-permissions").model,
	});

module.exports = {
	async process(ctx) {
		const {
			items,
			total,
			shippingOption,
			idempotencyKey, // prevent duplicate requests
			storedIntent, // in case the user has not make a purchase and come back to previously set-up cart
			email,
			savedCard,
		} = ctx.request.body;

		let serverTotal = 0;
		let unavailable = [];

		await Promise.all(
			items.map(async (clientItem) => {
				const serverItem = await strapi.services.variant.findOne({
					id: clientItem.variant.id,
				});

				if (serverItem.qty < clientItem.qty) {
					unavailable.push({
						id: serverItem.id,
						qty: serverItem.qty,
					});
				}

				serverTotal += serverItem.price * clientItem.qty; // get {price} from server to make sure the order is legit (i.e. to make sure the {price} is not manipulated by the client)
			})
		);

		//only executed after everything in Promise.all has completed SUCCESSFULLY
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
			((serverTotal + shippingValid.price) * 1.069).toFixed(2) !== total
		) {
			ctx.send({ error: "Invalid Cart" }, 400);
		} else if (unavailable.length > 0) {
			ctx.send({ unavailable }, 409);
		} else {
			if (storedIntent) {
				const update = await stripe.paymentIntents.update(
					storedIntent,
					{ amount: Math.round(total * 100) }, // 1$ === 100cents, so we *100 to get dollar
					{ idempotencyKey }
				);

				ctx.send({
					client_secret: update.client_secret,
					intentID: update.id,
				});
			}
			// create NEW paymentIntent (at Confirmation tab)
			else {
				let saved;

				if (savedCard) {
					// to get that corresponding card from Stripe
					const stripeMethods = await stripe.paymentMethods.list({
						customer: ctx.state.user.stripeID,
						type: "card",
					});

					saved = stripeMethods.data.find(
						(method) => method.card.last4 === savedCard
					);
				}

				const intent = await stripe.paymentIntents.create(
					{
						amount: total * 100,
						currency: "usd",
						customer: ctx.state.user
							? ctx.state.user.stripeID
							: undefined, // "guest" user
						receipt_email: email,
						payment_method: saved ? saved.id : undefined,
					},
					{ idempotencyKey }
				);

				ctx.send({
					client_secret: intent.client_secret,
					intentID: intent.id,
				});
			}
		}
	},

	async finalize(ctx) {
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
			transaction,
			paymentMethod,
			saveCard,
			cardSlot,
		} = ctx.request.body;

		let orderCustomer;

		if (ctx.state.user) {
			orderCustomer = ctx.state.user.id;
		} else {
			// user is not logged in
			orderCustomer = GUEST_ID;
		}

		const frequencies = await strapi.services.order.frequency();

		await Promise.all(
			// creates an isolated async-await block to validate & set the order
			items.map(async (clientItem) => {
				const serverItem = await strapi.services.variant.findOne({
					id: clientItem.variant.id,
				});

				if (clientItem.subscription) {
					const frequency = frequencies.find(
						(option) => option.label === clientItem.subscription
					);

					await strapi.services.subscription.create({
						user: orderCustomer,
						variant: clientItem.variant.id,
						name: clientItem.name,
						frequency: frequency.value,
						last_delivery: new Date(),
						next_delivery: frequency.delivery(),
						quantity: clientItem.qty,
						paymentMethod,
						shippingAddress,
						billingAddress,
						shippingInfo,
						billingInfo,
					});
				}

				await strapi.services.variant.update(
					{ id: clientItem.variant.id },
					{ qty: serverItem.qty - clientItem.qty }
				);
			})
		);

		if (saveCard && ctx.state.user) {
			// save card to db
			let newMethods = [...ctx.state.user.paymentMethods];

			newMethods[cardSlot] = paymentMethod;

			await strapi.plugins["users-permissions"].services.user.edit(
				{ id: orderCustomer },
				{ paymentMethods: newMethods }
			);
		}

		var order = await strapi.services.order.create({
			shippingAddress,
			billingAddress,
			shippingInfo,
			billingInfo,
			shippingOption,
			subtotal,
			tax,
			total,
			items,
			transaction,
			paymentMethod,
			user: orderCustomer,
		});

		order = sanitizeEntity(order, { model: strapi.models.order });

		// get from backend\api\order\services\order.js
		const confirmation = await strapi.services.order.confirmationEmail(
			order
		);

		await strapi.plugins["email"].services.email.send({
			to: order.billingInfo.email,
			subject: "LOCO Order Confirmation",
			html: confirmation,
		});

		if (order.user.username === "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536") {
			order.user = { username: "zhSarlO7JZXN4zAKjyBFW1x9ebt2c536" }; // set to that corresponding "Guest" to prevent leaking/sharing any of the other orders from other onboarding "Guest" checkouts
		}

		ctx.send({ order }, 200);
	},

	async removeCard(ctx) {
		const { card } = ctx.request.body;
		const { stripeID } = ctx.state.user;

		const stripeMethods = await stripe.paymentMethods.list({
			customer: stripeID,
			type: "card",
		});

		const stripeCard = stripeMethods.data.find(
			(method) => method.card.last4 === card
		);

		await stripe.paymentMethods.detach(stripeCard.id); // remove card from Stripe

		let newMethods = [...ctx.state.user.paymentMethods];

		const cardSlot = newMethods.findIndex(
			(method) => method.last4 === card
		);

		newMethods[cardSlot] = { brand: "", last4: "" }; // remove card from Strapi

		const newUser = await strapi.plugins[
			"users-permissions"
		].services.user.edit(
			{ id: ctx.state.user.id },
			{ paymentMethods: newMethods }
		);

		ctx.send({ user: sanitizeUser(newUser) }, 200);
	},

	async history(ctx) {
		const orders = await strapi.services.order.find({
			user: ctx.state.user.id,
		});

		const sanitizedOrders = orders.map((order) =>
			sanitizeEntity(order, { model: strapi.models.order })
		);

		ctx.send({ orders: sanitizedOrders }, 200);
	},
};
