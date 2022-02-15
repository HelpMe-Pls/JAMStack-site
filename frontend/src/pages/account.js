import React from "react"

import { useUser } from "../contexts"
import { useIsClient } from "../hooks"

import Layout from "../components/ui/layout"
import AuthPortal from "../components/auth/AuthPortal"
import SettingsPortal from "../components/settings/SettingsPortal"

export default function Account() {
	const { user } = useUser()
	const { isClient, key } = useIsClient()

	if (!isClient) return null

	return (
		<Layout key={key}>
			{user.jwt && user.onboarding ? (
				<SettingsPortal /> // {user.onboarding} only available AFTER we rendered the <Complete/> or the user is (still) logged in
			) : (
				<AuthPortal />
			)}
		</Layout>
	)
}
