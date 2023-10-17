
import { WaitButton } from "src/comps/common/WaitBtn"
import styles from "./style.m.less"

export class RecommendedEditor extends Comp<{
	related: string[],
	projID: string
}> {
	override produce() {
		return (
			<div cl={styles.wrapper}>
				<WaitButton
					onclick={async () => {
					const id = prompt("What image?");
					if (!id) return;

					try {
						const related = [...this.props.related, id];
						await Fire.data.update<Project>(
							Fire.data.doc(`projects`, this.props.projID),
							{ related }
						)
						this.re({related});
					}
					catch (error) {
						alert(error);
					}
				}}
				>Add</WaitButton>
				{this.props.related.map(id => (
					<div>
						{id}
						<WaitButton
							onclick={async () => {
							try {
								const related = this.props.related.filter(rID => rID !== id);
								await Fire.data.update<Project>(
									Fire.data.doc(`projects`, this.props.projID),
									{ related }
								)
								this.re({related});
							}
							catch (error) {
								alert(error);
							}
						}}
						>Remove</WaitButton>
					</div>
				))}
			</div>
		)
	}
}