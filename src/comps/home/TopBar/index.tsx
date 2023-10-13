
import { LangSwitch } from "src/comps/common/LangSwitch"
import styles from "./style.m.less"

export function TopBar({projects}: {projects?: boolean}) {
	return (
		<div cl={styles.wrapper}>
			<div cl={styles.start}>
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
	)
}