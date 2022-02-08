import React from "react"

function Icon({ color }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.947 29.4">
			<path
				fill={color || "#708670"}
				d="M15.474 0l4.836 9.671 10.638 1.547-7.737 7.543 1.74 10.639-9.478-5.029L6 29.4l1.737-10.638L0 11.218l10.638-1.547z"
			></path>
		</svg>
	)
}

export default Icon
