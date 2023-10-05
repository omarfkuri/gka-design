
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"

export function SectionPreview({section}: {section: Doc<Section>}) {
	return (
		<div cl={styles.wrapper}>
			<h5>{section.name}</h5>
			<p>{section.description}</p>
			<details cl={styles.images_wrapper}>
				<summary>Images ({String(section.images.length)})</summary>
				<div cl={styles.images_list}>
					{
						section.images.length
						?	section.images.map(image =>
							<div cl={styles.image_container}>
								<img src={image}/>
							</div>
						)
						: <div>No Images</div>
					}
				</div>
			</details>
		</div>
	)
}