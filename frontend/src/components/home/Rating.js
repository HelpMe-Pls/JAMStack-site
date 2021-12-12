import React from "react"
import { makeStyles } from "@material-ui/core/styles"

import fullStar from "../../images/full-star.svg"
import halfStar from "../../images/half-star.svg"
import emptyStar from "../../images/empty-star.svg"

const useStyles = makeStyles({
	size: {
		height: ({ size }) => `${size || 2}rem`,
		width: ({ size }) => `${size || 2}rem`,
	},
})

export default function Rating({ number, size }) {
	const empStar = 5 - Math.ceil(number) // get the empty stars (rounded up as whole)
	const classes = useStyles({ size })

	return (
		<>
			{
				// get fullStars rounded down as whole (3.5 => 3)
				// use spreading so that it gets the array's structure, not just the number
				[...Array(Math.floor(number))].map(
					(
						ele,
						i // {ele} is there just to make sure the {i} is the star's index, according to map()'s definition
					) => (
						<img
							src={fullStar}
							alt="full-star"
							key={i}
							className={classes.size}
						/>
					)
				)
			}
			{
				// there can only ONE half star for each rating so there's no need to map
				number % 1 !== 0 ? <img src={halfStar} alt="half-star" /> : null
			}
			{[...Array(empStar)].map((ele, i) => (
				<img src={emptyStar} alt="empty-star" key={`${i}-empty`} />
			))}
		</>
	)
}
