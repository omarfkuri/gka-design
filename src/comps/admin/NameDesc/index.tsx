import type { DocumentReference } from "firebase/firestore"
import styles from "./style.m.less"
import formStyles from "../../../style/comp/Form.m.less"

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
				<Form
					css={formStyles as FormStyles}
					onsubmit={async e => {
						e.preventDefault();
						e.target.querySelector("button")!.disabled = true;
						try {
							await Fire.data.update<T>(
								this.props.ref,
								{
									name: this.props.name.trim(),
									description: this.props.description.trim()
								} as any
							)
						}
						catch(err) {
							alert(err)
						}
						e.target.querySelector("button")!.disabled = false;
					}}
					submitText="Update"
					inputs={[
						{
							title: "Name",
							input: (
								<input 
									value={this.props.name}
									oninput={e => this.props.name = e.target.value}
								/>
							)
						},
						{
							title: "Description",
							input: (
								<input 
									value={this.props.description}
									oninput={e => this.props.description = e.target.value}
								/>
							)
						}
					]}
				/>
			</div>
		)
	}
}