
import styles from "./style.m.less";

export function MoveDown({targetID, behavior, inline, block, ...props}: Elements.Div & {targetID: string} & ScrollIntoViewOptions) {
	return (
		<div {...props} onclick={() => {
			document.getElementById(targetID)?.scrollIntoView({
				behavior, inline, block
			})
		}}>
			<img src="/down.svg" cl={styles.down} draggable="false"/>
		</div>
	)
}