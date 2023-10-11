
import type { Doc } from "@dunes/fire";
import type { Comp } from "@dunes/tag";
import styles from "src/style/views/admin/project.m.less";
import { Wrapper } from "src/comps/admin/Wrapper";
import { MessagePreview } from "src/comps/admin/MessagePreview";

export default class MessageView extends View {

	override willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}
	
	#messages?: Doc<Message>[]

	content({view}: {view: MessageView}, comp: Comp<{}>) {
		
		return (
			<Wrapper>
				<div cl={styles.list_wrapper}>
					{view.#messages
						? view.#messages.length
							? view.#messages.map(message => 
								<MessagePreview message={message}/>
							)
							: <div>No messages</div>
						: <div>Loading...</div>

					}
				</div>
			</Wrapper>
		)
	}

	override async hasShown() {

		if (!this.#messages) {

			this.#messages = await Fire.data.getCol<Message>(
				Fire.data.col(`messages`)
			)
			this.comp!.re();
		}
	}
}