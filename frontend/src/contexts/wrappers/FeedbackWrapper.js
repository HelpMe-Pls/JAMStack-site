import React, { useReducer, createContext, useContext } from "react"
import Snackbar from "@material-ui/core/Snackbar"
import { setSnackbar } from "../actions"
import feedbackReducer from "../reducers/feedback-reducer"

const FeedbackContext = createContext()
export const useFeedback = () => useContext(FeedbackContext)

export function FeedbackWrapper({ children }) {
	const [feedback, dispatchFeedback] = useReducer(feedbackReducer, {
		open: false,
		backgroundColor: "",
		message: "",
	})

	return (
		<FeedbackContext.Provider value={{ feedback, dispatchFeedback }}>
			{children}
			<Snackbar
				open={feedback.open}
				message={feedback.message}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				autoHideDuration={6000} // after 6s it automatically calls onClose
				onClose={() => dispatchFeedback(setSnackbar({ open: false }))}
				ContentProps={{
					style: {
						backgroundColor: feedback.backgroundColor,
						fontSize: "1.25rem",
					},
				}}
			/>
		</FeedbackContext.Provider>
	)
}
