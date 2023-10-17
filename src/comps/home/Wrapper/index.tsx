
import styles from "./style.m.less"
import { LangSwitch } from "src/comps/common/LangSwitch"

export function Wrapper({desc, projects}: {
	desc: any
	projects?: boolean
}) {
	return (
		<div id="app">
			<div cl={styles.topbar_wrapper}>
				<div cl={styles.topbar_container}>
					<div cl={styles.topbar_start}>
						<img 
							src="/logo.svg" 
							draggable={false}
							cl={`${styles.logo_container} click`}
							onclick={() => router.go(location.origin+"/")}
						/>
						<LangSwitch/>
					</div>
					{projects && (
						<Anchor href="/project/list">{ph._("back_to_list")}</Anchor>
					)}
				</div>
			</div>
			<div cl={styles.main}>{desc}</div>
		</div>
	)
}