
import { WaitButton } from "../../common/WaitBtn"
import styles from "./style.m.less"

export class SectionImage extends Comp<{
	src: string
	projID: string
	sectionID: string
}> {

	protected override produce(): JSX.Element {
	  return (
	  	<div cl={styles.wrapper}>
				<div cl={styles.container}>
					{this.props.src}
				</div>
				<div cl={styles.tools}>
					<WaitButton onclick={async () => {
						if (!confirm("Remove?")) return;

						try {
							await Fire.data.update<Section>(
								Fire.data.doc(`projects/${this.props.projID}/sections`, this.props.sectionID),
								{
									images: Fire.data.field.arrayRemove(this.props.src)
								}
							)
							this.re();
						}
						catch (error) {
							alert(error);
						}


					}}>Remove</WaitButton>
				</div>
			</div>
		)
	}
}