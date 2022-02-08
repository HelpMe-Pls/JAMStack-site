import React from "react"

function Icon({ color }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.945 29.4">
			<path
				fill="#7f7f7f"
				d="M15.472 0l4.836 9.671 10.638 1.547-7.737 7.543 1.74 10.639-9.478-5.029v-5.609"
				opacity="0.5"
			></path>
			<path
				fill={color || "#708670"}
				d="M15.473 0l-4.835 9.671L0 11.218l7.737 7.543L5.996 29.4l9.478-5.029v-5.609"
			></path>
		</svg>
	)
}

export default Icon
