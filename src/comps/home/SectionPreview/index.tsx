
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { SectionImage } from "../SectionImage"
import { ImgSlider } from "src/comps/common/ImgSlider"

export class SectionPreview extends Comp<{
	section: Doc<Section>,
	projID: string
}> {

	override produce() {
		return (
			<div cl={styles.wrapper}>
				{this.props.section.name.trim() && 
					<h2 cl={styles.name_container}>{this.props.section.name}</h2>
				}
				{this.props.section.description.trim() && 
					<div cl={styles.description_container}>{this.props.section.description}</div>
				}
				<div cl={styles.images_list}>
					{
						this.props.section.images.length
						?	<ImgSlider 
								images={this.props.section.images}
								map={src => (
									<SectionImage 
										src={src} 
										projID={this.props.projID}
										sectionID={this.props.section.id}
									/>
								)}
							/>
						: <div>{ph._("no_images")}</div>
					}
				</div>	
			</div>
		)
	}
}