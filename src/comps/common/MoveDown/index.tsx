
import styles from "./style.m.less";
import { $i } from "@dunes/dollar";

export function MoveDown({targetID, behavior, inline, block, ...props}: Elements.Div & {targetID: string} & ScrollIntoViewOptions) {
	return (
		<div {...props} onclick={() => 
			$i(targetID)?.scrollIntoView({behavior, inline, block})
		}>
			<img src="/down.svg" cl={styles.down} draggable="false"/>
		</div>
	)
}