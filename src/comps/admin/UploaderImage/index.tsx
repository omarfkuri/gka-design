
import type { Img } from "../Uploader"
import { WaitButton } from "../../common/WaitBtn"
import styles from "./style.m.less"
import { CopyButton } from "src/comps/common/CopyBtn"
import { Check } from "src/comps/common/Check"

export class UploaderImage extends Comp<{img: Img, selected: Set<string>}> {

	protected override produce(): JSX.Element {
		const path = `general/${this.props.img.src}`;
	  return (
	  	<div cl={styles.wrapper}>
	  		<div cl={styles.container}>
	  			<img src={this.props.img.url} draggable={false}/>
	  		</div>
	  		<div cl={styles.tools}>
					<Check checked={this.props.selected.has(path)} onInput={(e) => {
						if (e.target.checked) {
							this.props.selected.add(path);
						}
						else {
							this.props.selected.delete(path);
						}
					}}/>
	  			<CopyButton copyText={path}>
	  				Copy
	  			</CopyButton>
	  			<WaitButton
	  				onclick={async () => {
	  					if (!confirm("Delete?")) return;

	  					const ref = Fire.storage.path(path);

	  					try {
	  						await Fire.storage.rem(ref);
	  						this.root?.remove();
	  					}
	  					catch(error) {
	  						alert(error);
	  					}
	  				}}
	  			>Delete</WaitButton>
	  		</div>
	  	</div>
		)
	}
}