
import styles from "./style.m.less"

export function AdminView({desc, side, down}: {
	desc: any
	side?: any
	down?: boolean
}) {
	return (
		<div id="app">
			<div cl={down 
				? `${styles.sidebar_wrapper} ${styles.sidebar_wrapper_down}`
				: styles.sidebar_wrapper}>
				<div cl={styles.sidebar_info}>
					<div cl={styles.sidebar_info_title}>Admin</div>
					<div cl={styles.sidebar_info_links}>
						<Anchor href="/admin">Projects</Anchor>
						<Anchor href="/admin/messages">Messages</Anchor>
					</div>
				</div>
				{side && <div cl={styles.sidebar_container}>{side}</div>}
			</div>
			<div cl={down 
				? `${styles.main} ${styles.main_down}`
				: styles.main}>{desc}</div>
		</div>
	)
}