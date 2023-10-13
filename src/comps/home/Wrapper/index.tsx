
// import styles from "./style.m.less"

import { TopBar } from "../TopBar"

export function Wrapper({desc, projects}: {
	desc: any
	projects?: boolean
}) {
	return (
		<div id="app">
			<TopBar projects={projects}></TopBar>
			{desc}
		</div>
	)
}