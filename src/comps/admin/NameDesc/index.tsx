import type { DocumentReference } from "firebase/firestore"
import styles from "./style.m.less"
import { WaitButton } from "../../common/WaitBtn"

export class NameDesc<T extends {
	name: string
	description: string
}> extends Comp<{
	name: string
	description: string
	ref: DocumentReference<T>
}> {
	override produce() {
		return (
			<div cl={styles.wrapper}>
				<div 
					cl={styles.name}
					onkeydown={e => {
						this.props.name = e.target.innerText;
					}}
					contenteditable>{this.props.name}
				</div>
				<div
					cl={styles.description}
					onkeydown={e => {
						this.props.description = e.target.innerText;
					}}
					contenteditable>{this.props.description}
				</div>
				<WaitButton
					onclick={async () => {
						try {
							await Fire.store.updateDoc<T>(
								this.props.ref,
								{
									name: this.props.name,
									description: this.props.description
								} as any
							)
						}
						catch(err) {
							alert(err)
						}
					}}>Update
				</WaitButton>
			</div>
		)
	}
}