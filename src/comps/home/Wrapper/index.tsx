
// import styles from "./style.m.less"

import { TopBar } from "../TopBar"

export function Wrapper({desc}: {
	desc: any
}) {
	return (
		<div id="app">
			<TopBar></TopBar>
			{desc}
		</div>
	)
}