"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

const stripe = require("stripe")(process.env.STRIPE_SK);

module.exports = {
	/**
	 * Simple example.
	 * Every monday at 1am.
	 */
	// '0 1 * * 1': () => {
	//
	// }

	// every day at 8am:
	"0 8 * * *": async () => {
		const subscriptions = await strapi.services.subscription.find({
			next_delivery: new Date(), // new Date() is today --> find those subscriptions that has the next_delivery date is today
		});

		// Promis.all() will stop executing if one of its "await" fails, but we don't want that, for instance if a customer's card get declined coz they don't have enough money, then we'd want to keep other customers subscription being placed, that's y we're using Promise.allSettled()
		await Promise.allSettled(
			subscriptions.map(async (subscription) => {
				// get all of their cards
				const paymentMethods = await stripe.paymentMethods.list({
					customer: subscription.user.stripeID,
					type: "card",
				});

				// get the card which is set for subscription
				const paymentMethod = paymentMethods.data.find(
					(method) =>
						method.card.last4 === subscription.paymentMethod.last4
				);

				try {
					const paymentIntent = await stripe.paymentIntents.create({
						amount: Math.round(
							subscription.variant.price * 1.096 * 100
						),
						currency: "usd",
						customer: subscription.user.stripeID,
						payment_method: paymentMethod.id,
						// last 2 fields are for subscription's automatic charges
						off_session: true,
						confirm: true,
					});

					var order = await strapi.services.order.create({
						shippingAddress: subscription.shippingAddress,
						billingAddress: subscription.billingAddress,
						shippingInfo: subscription.shippingInfo,
						billingInfo: subscription.billingInfo,
						shippingOption: { label: "subscription", price: 0 },
						subtotal: subscription.variant.price,
						total: subscription.variant.price * 1.096,
						tax: subscription.variant.price * 0.096,
						items: [
							{
								variant: subscription.variant,
								name: subscription.name,
								qty: subscription.quantity,
								stock: subscription.variant.qty,
								product: subscription.variant.product,
							},
						],
						transaction: paymentIntent.id,
						paymentMethod: subscription.paymentMethod,
						user: subscription.user.id,
						subscription: subscription.id,
					});

					const confirmation =
						await strapi.services.order.confirmationEmail(order);

					await strapi.plugins["email"].services.email.send({
						to: subscription.billingInfo.email,
						subject: "LOCO Order Confirmation",
						html: confirmation,
					});

					// update "next_delivery" date for consecutive deliveries
					const frequencies = await strapi.services.order.frequency();
					const frequency = frequencies.find(
						(option) => option.value === subscription.frequency
					);

					await strapi.services.subscription.update(
						{ id: subscription.id },
						{
							last_delivery: new Date(),
							next_delivery: frequency.delivery(),
						}
					);
				} catch (error) {
					//Notify customer payment failed, and prompt them to enter new information
					console.log(error);
				}
			})
		);
	},
};
