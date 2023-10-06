
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { WaitButton } from "../WaitBtn"

export class SectionPreview extends Comp<{
	section: Doc<Section>,
	projID: string
}> {
	
	async #replaceSection() {
		this.props.section = (await Fire.store.getDoc<Section>(
			Fire.store.doc(`projects/${this.props.projID}/sections`,
				this.props.section.id
			)
		))!
	}

	override produce() {
		return (
			<div cl={styles.wrapper}>
				<h5>{this.props.section.name}</h5>
				<p>{this.props.section.description}</p>
				<details cl={styles.images_wrapper}>
					<summary>Images ({String(this.props.section.images.length)})</summary>
					<WaitButton onclick={async () => {
						const link = prompt("What image?");
						if (!link) return;

						try {
							await Fire.store.updateDoc<Section>(
								Fire.store.doc(`projects/${this.props.projID}/sections`, this.props.section.id),
								{
									images: Fire.store.field.arrayUnion(link)
								}
							)
							await this.#replaceSection();
							this.re();
						}
						catch (error) {
							alert(error);
						}


					}}>Add</WaitButton>
					<div cl={styles.image_list}>
						{
							this.props.section.images.length
							?	this.props.section.images.map(src =>
								<div cl={styles.image_wrapper}>
									<div cl={styles.image_container}>
										{src}
									</div>
									<div cl={styles.image_tools}>
										<WaitButton onclick={async () => {
											if (!confirm("Remove?")) return;

											try {
												await Fire.store.updateDoc<Section>(
													Fire.store.doc("projects", this.props.section.id),
													{
														images: Fire.store.field.arrayUnion(src)
													}
												)
											}
											catch (error) {
												alert(error);
											}


										}}>Remove</WaitButton>
									</div>
								</div>
							)
							: <div>No Images</div>
						}
					</div>
				</details>
			</div>
		)
	}
}