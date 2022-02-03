import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

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
		[theme.breakpoints.down("xs")]: {
			overflow: "hidden",
			width: "100%",
		},
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
		[theme.breakpoints.down("xs")]: {
			fontSize: "1.2rem",
		},
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
			height: "12.3rem",
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
			height: "4rem",
			width: "5rem",
		},
	},
	textField: {
		width: "30rem",
		[theme.breakpoints.down("xs")]: {
			width: "18rem",
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
			fontSize: "2.25rem",
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

	const [values, setValues] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	})
	const [errors, setErrors] = useState({})

	// setting this structure as an object because we need unique field names
	const fields = {
		name: {
			helperText: "Please enter your name",
			placeholder: "Name",
			adornment: <img src={nameAdornment} alt="name" />,
		},
		email: {
			helperText: "Invalid email",
			placeholder: "Email",
			adornment: (
				<div className={classes.emailAdornment}>
					<Email color={theme.palette.secondary.main} />
				</div>
			),
		},
		phone: {
			helperText: "Invalid phone number",
			placeholder: "Phone Number",
			adornment: (
				<div className={classes.phoneAdornment}>
					<Phone color={theme.palette.secondary.main} />
				</div>
			),
		},
		message: {
			helperText: "Please enter a message",
			placeholder: "Message",
			inputClasses: {
				multiline: classes.multiline,
				error: classes.multilineError,
			},
		},
	}

	const info = [
		{
			label: (
				<span>
					6996 Random St {matchesXS ? <br /> : null}
					HCMC, VN 69996
				</span>
			),
			icon: (
				<img
					className={classes.contactIcon}
					src={address}
					alt="address"
				/>
			),
		},
		{
			label: "(+84) 369 149 942",
			icon: (
				<div className={classes.contactIcon}>
					<Phone />
				</div>
			),
		},
		{
			label: "khoile5399@gmail.com",
			icon: (
				<div className={classes.contactEmailIcon}>
					<Email color="#fff" />
				</div>
			),
		},
	]

	const disabled =
		Object.keys(errors).some(error => errors[error] === true) ||
		Object.keys(errors).length < 4 // to disable the "send message" button if there's any empty input

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

						{/* Input fields */}
						<Grid item>
							<Grid container direction="column">
								{Object.keys(fields).map(field => {
									const validateHelper = event => {
										return validate({
											[field]: event.target.value,
										})
									}
									return (
										<Grid
											item
											key={field}
											classes={{
												root:
													field === "message"
														? classes.multilineContainer
														: classes.fieldContainer,
											}}
										>
											<TextField
												value={values[field]}
												onChange={e => {
													const valid =
														validateHelper(e)

													if (
														errors[field] ||
														valid[field] === true
													) {
														setErrors({
															...errors,
															[field]:
																!valid[field],
														})
													}
													// not using ternary operator here because {setValues} has to be called everytime, not just in "no errors field" cases
													setValues({
														...values,
														[field]: e.target.value,
													})
												}}
												// onBlur will be called when the user clicks away from the input
												onBlur={e => {
													const valid =
														validateHelper(e)
													setErrors({
														...errors,
														[field]: !valid[field],
													})
												}}
												error={errors[field]}
												helperText={
													errors[field] &&
													fields[field].helperText
												}
												placeholder={
													fields[field].placeholder
												}
												classes={{
													root: classes.textField,
												}}
												multiline={field === "message"}
												rows={
													field === "message"
														? 6
														: undefined
												}
												InputProps={{
													// https://mui.com/api/text-field/#props
													// https://mui.com/api/outlined-input/#props
													// https://mui.com/api/input-adornment/#props
													classes: {
														input: classes.input,
														// only applied for the {message}, the rest of them will have the above {classes.input}
														// used spread operator because {inputClasses} has 2 fields, and we wanna take all of it
														...fields[field]
															.inputClasses,
													},
													disableUnderline:
														field === "message",
													startAdornment:
														field ===
														"message" ? undefined : (
															<InputAdornment position="start">
																{
																	fields[
																		field
																	].adornment
																}
															</InputAdornment>
														),
												}}
											/>
										</Grid>
									)
								})}
							</Grid>
						</Grid>
						<Grid
							item
							component={Button}
							disabled={disabled}
							classes={{
								root: clsx(
									classes.buttonContainer,
									classes.blockContainer,
									{
										[classes.buttonDisabled]: disabled,
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
						{info.map((section, i) => (
							<Grid
								item
								key={section.label}
								container
								alignItems="center"
								classes={{
									root:
										i === 1
											? classes.middleInfo
											: undefined,
								}}
							>
								<Grid
									item
									classes={{ root: classes.iconContainer }}
								>
									{section.icon}
								</Grid>
								<Grid item>
									<Typography
										variant="h2"
										classes={{ root: classes.contactInfo }}
									>
										{section.label}
									</Typography>
								</Grid>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Layout>
	)
}

export default ContactPage
