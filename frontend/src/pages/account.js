import React from "react"

import { useUser } from "../contexts"

import Layout from "../components/ui/layout"
import AuthPortal from "../components/auth/AuthPortal"
import SettingsPortal from "../components/settings/SettingsPortal"

export default function Account() {
	const { user } = useUser()

	return (
		<Layout>
			{user.jwt && user.onboarding ? (
				<SettingsPortal /> // {user.onboarding} only available AFTER we rendered the <Complete/>
			) : (
				<AuthPortal />
			)}
		</Layout>
	)
}
