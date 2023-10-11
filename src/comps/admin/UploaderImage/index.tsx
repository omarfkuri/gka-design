
import type { Img } from "../Uploader"
import { WaitButton } from "../../common/WaitBtn"
import styles from "./style.m.less"
import { CopyButton } from "src/comps/common/CopyBtn"

export class UploaderImage extends Comp<{img: Img}> {

	protected override produce(): JSX.Element {
	  return (
	  	<div cl={styles.wrapper}>
	  		<div cl={styles.container}>
	  			<img src={this.props.img.url} draggable={false}/>
	  		</div>
	  		<div cl={styles.tools}>
	  			<CopyButton copyText={`general/${this.props.img.src}`}>
	  				Copy
	  			</CopyButton>
	  			<WaitButton
	  				onclick={async () => {
	  					if (!confirm("Delete?")) return;

	  					const ref = Fire.storage.path(`general/${this.props.img.src}`);

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