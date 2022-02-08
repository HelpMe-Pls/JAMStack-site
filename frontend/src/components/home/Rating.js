import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import FullStar from "../../images/FullStar"
import HalfStar from "../../images/HalfStar"
import EmptyStar from "../../images/EmptyStar"

const useStyles = makeStyles(() => ({
	icon: {
		height: ({ size }) => `${size || 2}rem`,
		width: ({ size }) => `${size || 2}rem`,
	},
}))

export default function Rating({ star, size, color }) {
	const empStar = 5 - Math.ceil(star) // get the empty stars (rounded up as whole)
	const classes = useStyles({ size })

	return (
		<>
			{
				// get fullStars rounded down as whole (3.5 => 3)
				// use spreading so that it gets the array's structure, not just the number
				[...Array(Math.floor(star))].map(
					(
						ele,
						i // {ele} is there just to make sure the {i} is the star's index, according to map()'s definition
					) => (
						<span className={classes.icon}>
							<FullStar key={i} color={color} />
						</span>
					)
				)
			}
			{
				// there can only ONE half star for each rating so there's no need to map
				star % 1 !== 0 ? (
					<span className={classes.icon}>
						<HalfStar color={color} />
					</span>
				) : null
			}
			{[...Array(empStar)].map((ele, i) => (
				<span className={classes.icon}>
					<EmptyStar key={`${i}-empty`} />
				</span>
			))}
		</>
	)
}
