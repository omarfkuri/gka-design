
import type { CollectionReference } from "firebase/firestore"

import formStyles from "../../../style/comp/Form.m.less";

export const MessageForm: Component<{
	messagesRef: CollectionReference<Message>
	email?: string
	content?: string
	sent?: boolean
}> = ({messagesRef, email="", sent=false, content=""}, comp) => {
	return (
		sent
		? (
			<div>
				<div>{ph._("send_success")}</div>
				<button onclick={() => comp.re({sent: false})}>
					{ph._("send_another")}
				</button>
			</div>
		)
		: (
			<Form 
				submitText={ph._("send_button")}
				titleText={ph._("send_message")}
				onsubmit={async e => {
					e.preventDefault();

					try {
						await Fire.data.add(messagesRef, {
							email, 
							content, 
							createdAt: Fire.data.stamp(),
							updatedAt: Fire.data.stamp(),
							read: false
						})
						comp.re({
							email: "",
							content: "",
							sent: true
						});
					}
					catch(error) {
						alert(error)
					}
				}}
				inputs={[
					{
						title: ph._("email"),
						input: (
							<input 
								oninput={e => email = e.target.value}
								type="email" required
							/>
						)
					},
					{
						title: ph._("message"),
						input: (
							<textarea 
								oninput={e => content = e.target.value}
								required
							/>
						)
					}
				]}
				css={formStyles as FormStyles}
			/>
		)

	)
}