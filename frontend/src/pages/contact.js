import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
//import { Link } from "gatsby"

import address from "../images/address.svg"
import send from "../images/send.svg"
import nameAdornment from "../images/name-adornment.svg"

import Email from "../images/EmailAdornment.js"
import Phone from "../images/PhoneAdornment.js"

import Layout from "../components/ui/layout"
import validate from "../components/ui/validate"

const useStyles = makeStyles(theme => ({
	mainContainer: {
		height: "40rem",
		backgroundColor: theme.palette.primary.main,
		margin: "10rem 0",
		[theme.breakpoints.down("md")]: {
			marginTop: "8rem",
			height: "90rem",
		},
	},
	formContainer: {
		height: "100%",
	},
	formWrapper: {
		height: "100%",
		[theme.breakpoints.down("md")]: {
			height: "50%", // so that it can stack on top of the contactInfo
			marginTop: "-8rem",
		},
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
	},
	formContainer: {
		height: "100%",
	},
	blockContainer: {
		backgroundColor: theme.palette.secondary.main,
		height: "6rem",
		width: "35rem",
		// apply flex layout for the "Contact Us" and "send message"
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			width: "30rem",
		},
		[theme.breakpoints.down("xs")]: {
			width: "100%",
		},
	},
	titleContainer: {
		marginTop: "-3rem",
	},
	buttonContainer: {
		marginBottom: "-3rem",
		textTransform: "none",
		borderRadius: 0,
		"&:hover": {
			backgroundColor: theme.palette.secondary.light,
		},
	},
	sendIcon: {
		marginLeft: "2rem",
	},
	contactInfo: {
		fontSize: "1.5rem",
		marginLeft: "1rem",
	},
	contactIcon: {
		height: "3rem",
		width: "3rem",
	},
	contactEmailIcon: {
		height: "2.25rem",
		width: "3rem",
	},
	infoContainer: {
		height: "21.25rem",
		[theme.breakpoints.down("xs")]: {
			height: "15.25rem",
		},
	},
	middleInfo: {
		borderTop: "2px solid #fff",
		borderBottom: "2px solid #fff",
	},
	iconContainer: {
		borderRight: "2px solid #fff",
		height: "7rem",
		width: "8rem",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("xs")]: {
			height: "5rem",
			width: "6rem",
		},
	},
	textField: {
		width: "30rem",
		[theme.breakpoints.down("sm")]: {
			width: "20rem",
		},
	},
	input: {
		color: "#fff",
	},
	emailAdornment: {
		height: 17,
		width: 22,
		marginBottom: 10,
	},
	phoneAdornment: {
		width: 25.173,
		height: 25.122,
	},
	fieldContainer: {
		marginBottom: "1rem",
	},
	multilineContainer: {
		marginTop: "1rem",
	},
	multiline: {
		border: "2px solid #fff",
		borderRadius: 10,
		padding: "1rem",
	},
	multilineError: {
		border: `2px solid ${theme.palette.error.main}`,
	},
	buttonDisabled: {
		backgroundColor: theme.palette.grey[500],
	},
	sendMessage: {
		[theme.breakpoints.down("xs")]: {
			fontSize: "2.5rem",
		},
	},
	// use Inspect Element with @global styling to apply styles for very specific elements
	// that you may not be able to figure it out in your code
	// especially for components that have different styles for different effects (hover, onBlur...)
	// these styles are always applied even if their classes aren't mentioned in the component
	// well, in this case they're actually located in the <TextField> but it's abstracted away
	// due to compound styling that are applied to the <TextField>'s {InputProp} (https://mui.com/api/text-field/#props),
	// therefore it's hard to track what specific CSS class it is >> using Inspect Element is a faster way to find it
	"@global": {
		// Inspect element (of the form's input) >> find the <div> where it says ::before && ::after
		// Click on that <div> >> go to Styles >> Scroll down >> you'll find these styles
		".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before":
			{
				borderBottom: "2px solid #fff",
			},
		".MuiInput-underline:after": {
			borderBottom: `2px solid ${theme.palette.secondary.main}`,
		},
	},
}))

const ContactPage = () => {
	const classes = useStyles()
	const theme = useTheme()

	const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))
	const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [message, setMessage] = useState("")
	const [errors, setError] = useState({})

	return (
		<Layout>
			<Grid
				container
				justifyContent="space-around"
				alignItems="center"
				direction={matchesMD ? "column" : "row"}
				classes={{ root: classes.mainContainer }}
			>
				{/* Contact form */}
				<Grid item classes={{ root: classes.formWrapper }}>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						alignItems="center"
						className={classes.formContainer}
					>
						<Grid
							item
							classes={{
								root: clsx(
									classes.titleContainer,
									classes.blockContainer
								),
							}}
						>
							<Typography variant="h4">Contact Us</Typography>
						</Grid>
						<Grid item>
							<Grid container direction="column">
								<Grid
									item
									classes={{ root: classes.fieldContainer }}
								>
									<TextField
										value={name}
										onChange={e => {
											if (errors.name) {
												const valid = validate({
													name: e.target.value,
												})
												setError({
													...errors,
													name: !valid.name,
												})
											}
											setName(e.target.value)
										}}
										// onBlur will be called when the user clicks away from the input
										onBlur={e => {
											const valid = validate({ name }) // from value={name}
											setError({
												...errors,
												name: !valid.name,
											})
										}}
										error={errors.name}
										helperText={
											errors.name && "Please enter a name"
										}
										placeholder="Name"
										classes={{ root: classes.textField }}
										InputProps={{
											classes: { input: classes.input },
											startAdornment: (
												<InputAdornment position="start">
													<img
														src={nameAdornment}
														alt="name"
													/>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid
									item
									classes={{ root: classes.fieldContainer }}
								>
									<TextField
										value={email}
										onChange={e => {
											if (errors.email) {
												const valid = validate({
													email: e.target.value,
												})
												setError({
													...errors,
													email: !valid.email,
												})
											}
											setEmail(e.target.value)
										}}
										onBlur={e => {
											const valid = validate({ email }) // from value={name}
											setError({
												...errors,
												email: !valid.email,
											})
										}}
										error={errors.email}
										helperText={
											errors.email && "Invalid email"
										}
										placeholder="Email"
										classes={{ root: classes.textField }}
										InputProps={{
											classes: { input: classes.input },
											startAdornment: (
												<InputAdornment position="start">
													<div
														className={
															classes.emailAdornment
														}
													>
														<Email
															color={
																theme.palette
																	.secondary
																	.main
															}
														/>
													</div>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid
									item
									classes={{ root: classes.fieldContainer }}
								>
									<TextField
										value={phoneNumber}
										onChange={e => {
											if (errors.phone) {
												const valid = validate({
													phone: e.target.value,
												})
												setError({
													...errors,
													phone: !valid.phone,
												})
											}
											setPhoneNumber(e.target.value)
										}}
										onBlur={e => {
											const valid = validate({
												phone: phoneNumber,
												// the object passed into validate() has a different field name (phone != phoneNumber)
												// that's why there's no destructuring here
											})
											setError({
												...errors,
												phone: !valid.phone,
											})
										}}
										error={errors.phone}
										helperText={
											errors.phone && "Invalid number"
										}
										placeholder="Phone Number"
										classes={{ root: classes.textField }}
										InputProps={{
											classes: { input: classes.input },
											startAdornment: (
												<InputAdornment position="start">
													<div
														className={
															classes.phoneAdornment
														}
													>
														<Phone
															color={
																theme.palette
																	.secondary
																	.main
															}
														/>
													</div>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid
									item
									classes={{
										root: classes.multilineContainer,
									}}
								>
									<TextField
										value={message}
										onChange={e => {
											if (errors.message) {
												const valid = validate({
													message: e.target.value,
												})
												setError({
													...errors,
													message: !valid.message,
												})
											}
											setMessage(e.target.value)
										}}
										onBlur={e => {
											const valid = validate({ message })
											setError({
												...errors,
												message: !valid.message,
											})
										}}
										error={errors.message}
										helperText={
											errors.message &&
											"Please enter a message"
										}
										placeholder="Message"
										classes={{ root: classes.textField }}
										multiline
										rows={6}
										InputProps={{
											disableUnderline: true,
											classes: {
												input: classes.input,
												multiline: classes.multiline,
												error: classes.multilineError,
											},
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							component={Button}
							disabled={Object.keys(errors).some(
								field => errors[field] === true
							)}
							classes={{
								root: clsx(
									classes.buttonContainer,
									classes.blockContainer,
									{
										[classes.buttonDisabled]: Object.keys(
											errors
										).some(field => errors[field] === true),
									}
								),
							}}
						>
							<Typography
								variant="h4"
								classes={{ root: classes.sendMessage }}
							>
								Send message
							</Typography>
							<img
								src={send}
								className={classes.sendIcon}
								alt="send message"
							/>
						</Grid>
					</Grid>
				</Grid>

				{/* Contact info */}
				<Grid item>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						classes={{ root: classes.infoContainer }}
					>
						<Grid item container alignItems="center">
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								<img
									src={address}
									className={classes.contactIcon}
									alt="address"
								/>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									6996 Random St {matchesXS ? <br /> : null}
									HCMC, VN 69996
								</Typography>
							</Grid>
						</Grid>
						<Grid
							item
							container
							alignItems="center"
							classes={{ root: classes.middleInfo }}
						>
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								<div className={classes.contactIcon}>
									<Phone />
								</div>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									(+84) 369 149 942
								</Typography>
							</Grid>
						</Grid>
						<Grid item container alignItems="center">
							<Grid
								item
								classes={{ root: classes.iconContainer }}
							>
								{/* the customized SVG icon couldn't be displayed (scaled) without being
								contained in a parent with set dimensions */}
								<div className={classes.contactEmailIcon}>
									<Email color="#fff" />
								</div>
							</Grid>
							<Grid item>
								<Typography
									variant="h2"
									classes={{ root: classes.contactInfo }}
								>
									khoile5399@gmail.com
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Layout>
	)
}

export default ContactPage
