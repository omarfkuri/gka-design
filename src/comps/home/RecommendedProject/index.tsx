
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"

export class RecommendedProject extends Comp<{
	project: Doc<Project>
}> {

	#image?: string

	protected override produce() {
		return (
			<Anchor cl={styles.wrapper} href={`/project/${this.props.project.id}`}>
				<div cl={styles.image}>
					{this.#image
						? <img src={this.#image} alt={this.props.project.name}/>
						: <div>{ph._("loading")}</div>
					}
				</div>
				<div cl={styles.info}>
					<div cl={styles.info_title}>{this.props.project.name}</div>
					<div cl={styles.info_description}>{this.props.project.description}</div>
				</div>
			</Anchor>
		)
	}

	override hasRendered(): void {
		if (this.#image) return;
		if (this.props.project.cover.startsWith("https://")) return;
	  Fire.storage.url(Fire.storage.path(this.props.project.cover))
	  .then(src => {
	  	this.#image = src;
	  	this.re({})
	  })
	  .catch(console.warn)
	}
}