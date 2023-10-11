
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { WaitButton } from "src/comps/common/WaitBtn"

export class MessagePreview extends Comp<{
	message: Doc<Message>,
}> {

	override produce() {
		const messageRef = Fire.data.doc<Message>(
			"messages", this.props.message.id
		);
		return (
			<div cl={styles.wrapper}>
				<div cl={styles.email}>{this.props.message.email}</div>
				<div cl={styles.content}>{this.props.message.content}</div>
				<div cl={styles.actions}>
					<WaitButton onclick={async () => {
						if (!confirm("Delete message?")) return;
						try {
							await Fire.data.remove(messageRef);
							this.root!.remove();
						}
						catch(error) {
							alert(error)
						}
					}}>
						Delete
					</WaitButton>
					<WaitButton onclick={async () => {
						try {
							await Fire.data.update(messageRef, {
								read: true
							});
						}
						catch(error) {
							alert(error)
						}
					}}>
						Read
					</WaitButton>
				</div>
			</div>
		)
	}
}