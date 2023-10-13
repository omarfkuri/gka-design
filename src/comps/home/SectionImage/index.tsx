
import styles from "./style.m.less"

export class SectionImage extends Comp<{
	src: string
	projID: string
	sectionID: string
}> {

	protected override produce(): JSX.Element {
	  return (
	  	<div cl={styles.wrapper}>
	  		{this.props.src.startsWith("https://")
	  			? <img src={this.props.src}/>
	  			: ph._("loading")
	  		}
			</div>
		)
	}

	override hasRendered(): void {
		if (this.props.src.startsWith("https://")) return;
	  Fire.storage.url(Fire.storage.path(this.props.src))
	  .then(src => this.re({src}))
	  .catch(console.warn)
	}
}