
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { WaitButton } from "../../common/WaitBtn"
import { NameDesc } from "../NameDesc"
import { Accordion } from "../../common/Accordion"
import { SectionImage } from "../SectionImage"

export class AdminSectionPreview extends Comp<{
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
		const ref = Fire.store.doc<Section>(`projects/${this.props.projID}/sections`, this.props.section.id);
		return (
			<div cl={styles.wrapper}>
				<NameDesc
					name={this.props.section.name}
					description={this.props.section.description}
					ref={ref}
				/>
				<div cl={styles.controls_wrapper}>
					<WaitButton onclick={async() => {
						if (!confirm("Delete?")) return;

						try {
							await Fire.store.remDoc(ref);
						}
						catch(error) {
							alert(error);
						}

					}}>Delete</WaitButton>
				</div>
				<Accordion cl={styles.images_wrapper} show={
					(btn) => (
						<div cl={styles.images_summary_wrapper}>
							<div cl={styles.images_summary_start}>
								Images ({String(this.props.section.images.length)})
							</div>
							<div cl={styles.images_summary_end}>
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
								{btn}
							</div>
						</div>
					)
				}>
					<div cl={styles.images_list}>
						{
							this.props.section.images.length
							?	this.props.section.images.map(src =>
								<SectionImage 
									src={src} 
									projID={this.props.projID}
									sectionID={this.props.section.id}
								/>
							)
							: <div>No Images</div>
						}
					</div>					
				</Accordion>
			</div>
		)
	}
}