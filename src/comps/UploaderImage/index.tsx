
import type { Img } from "../Uploader"
import { WaitButton } from "../WaitBtn"
import styles from "./style.m.less"

export class UploaderImage extends Comp<{img: Img}> {

	protected override produce(): JSX.Element {
	  return (
	  	<div cl={styles.wrapper}>
	  		<div cl={styles.container}>
	  			<img src={this.props.img.url} draggable={false}/>
	  		</div>
	  		<div cl={styles.tools}>
	  			<WaitButton
	  				onclick={async () => {
	  					try {
	  						await navigator.clipboard.writeText(
	  							`general/${this.props.img.src}`
	  						)
	  						alert("Copied!")
	  					}
	  					catch(error) {
	  						alert(error);
	  					}
	  				}}
	  			>Copy</WaitButton>
	  			<WaitButton
	  				onclick={async () => {
	  					if (!confirm("Delete?")) return;

	  					const ref = Fire.storage.path(`general/${this.props.img.src}`);

	  					try {
	  						await Fire.storage.rem(ref);
	  						// delete
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