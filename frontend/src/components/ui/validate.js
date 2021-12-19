export default function validate(input) {
	// input = {field1: value1, field2: value2}
	// e.g. { email: random@loco.com, phone: 6969696969 }
	// output: { field: valid } >> e.g. { email: true, phone: true }
	const validators = {
		// each field is a function returning a boolean: true if valid, false if invalid
		email: val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val),
		phone: val =>
			/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(val),
		name: val => val.length > 3,
		message: val => val.length > 3,
		//   password: val =>
		//     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
		//       val
		//     ),
		//   confirmation: val =>
		//     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
		//       val
		//     ),
		//   street: val =>
		//     /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/.test(
		//       val
		//     ),
		//   zip: val => /^\d{5}(-\d{4})?$/.test(val),
		//   promo: val => true,
		//   city: val => val.length !== 0,
		//   state: val => val.length !== 0,
	}

	const valid = {}

	// map[email, phone] (from {input}) ==> valid = {email, phone}
	// example for <email>:
	// valid.email = validators.email(input.email)
	// ==> valid.email = validators.email(random@loco.com)
	// ==> valid.email = true
	// ==> valid = {email: true}
	Object.keys(input).map(field => {
		return (valid[field] = validators[field](input[field]))
	})

	return valid
}
