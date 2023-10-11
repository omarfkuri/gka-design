
import styles from "./style.m.less"

export function TopBar() {
	return (
		<div cl={styles.wrapper}>
			<img 
				cl={`${styles.logo_container} click`}
				onclick={() => router.go(location.origin+"/")}
				src="/logo.svg" draggable={false}/>
		</div>
	)
}