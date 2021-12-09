import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Lottie from "react-lottie"

import animationData from "../../images/data.json"

export default function HeroBlock() {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData,
	}

	return (
		<Grid container justify="space-around" alignItems="center">
			{/* for intro */}
			<Grid item>
				<Grid container direction="column">
					<Grid item>
						<Typography variant="h1" align="center">
							The Premier
							<br />
							Developer Clothing Brand
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="h3" align="center">
							high quality, custom-designed shirts, hats, and
							hoodies
						</Typography>
					</Grid>
				</Grid>
			</Grid>

			{/* for animation */}
			<Grid item>
				<Lottie options={defaultOptions} width="30rem" />
			</Grid>
		</Grid>
	)
}
