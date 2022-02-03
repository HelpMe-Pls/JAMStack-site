import { createTheme } from "@material-ui/core/styles"

// const green = "#99B898"
// const darkGreen = "#708670"
const blue = "#7FB2F0"
const darkBlue = "#4E7AC7"
const tan = "#FECEA8"
const lightRed = "#FF847C"
const red = "#E84A5F"
const offBlack = "#2A363B"
const grey = "#747474"

const theme = createTheme({
	palette: {
		primary: {
			main: blue,
		},
		secondary: {
			main: darkBlue,
		},
		common: {
			tan,
			lightRed,
			red,
			offBlack,
		},
	},
	typography: {
		h1: {
			fontSize: "4.5rem",
			fontFamily: "Philosopher",
			fontStyle: "italic",
			fontWeight: 700,
			color: darkBlue,
		},
		h2: {
			fontFamily: "Montserrat",
			fontSize: "3rem",
			fontWeight: 500,
			color: "#fff",
		},
		h3: {
			fontFamily: "Montserrat",
			fontSize: "2rem",
			fontWeight: 300,
			color: blue,
		},
		h4: {
			fontFamily: "Philosopher",
			fontStyle: "italic",
			fontWeight: 700,
			fontSize: "3rem",
			color: "#fff",
		},
		h5: {
			fontFamily: "Philosopher",
			fontSize: "2rem",
			fontWeight: 700,
			fontStyle: "italic",
			color: "#fff",
		},
		body1: {
			fontFamily: "Montserrat",
			fontSize: "1.5rem",
			color: grey,
		},
		body2: {
			fontFamily: "Montserrat",
			fontSize: "1.3rem",
			color: "#fff",
		},
	},
	overrides: {
		MuiChip: {
			root: {
				backgroundColor: darkBlue,
			},
			label: {
				fontFamily: "Montserrat",
				fontSize: "1.5rem",
				color: "#fff",
				fontWeight: 400,
			},
		},
	},
})

export default theme
