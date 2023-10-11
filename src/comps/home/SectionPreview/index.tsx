
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
				<h2>{this.props.section.name}</h2>
				<p>{this.props.section.description}</p>
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
						: <div>No Images</div>
					}
				</div>	
			</div>
		)
	}
}