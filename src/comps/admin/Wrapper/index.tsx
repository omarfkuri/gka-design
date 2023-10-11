
import styles from "./style.m.less"

export function Wrapper({desc, side}: {
	desc: any
	side?: any
}) {
	return (
		<div id="app">
			<div cl={styles.sidebar_wrapper}>
				<div cl={styles.sidebar_info}>
					<div cl={styles.sidebar_info_title}>Admin</div>
					<div cl={styles.sidebar_info_links}>
						<Anchor href="/">Home</Anchor>
						<Anchor href="/admin">Projects</Anchor>
						<Anchor href="/admin/messages">Messages</Anchor>
					</div>
				</div>
				{side && <div cl={styles.sidebar_container}>{side}</div>}
			</div>
			<div cl={styles.main}>{desc}</div>
		</div>
	)
}