
import styles from "./style.m.less"

export function AdminView({desc, side}: {
	desc: any
	side?: any
}) {
	return (
		<div id="app">
			<div cl={styles.sidebar_wrapper}>
				<h2>Admin</h2>
				<div cl={styles.sidebar_links}>
					<Anchor href="/admin">Projects</Anchor>
					<Anchor href="/admin/images">Images</Anchor>
				</div>
				{side && <div cl={styles.sidebar_content}>{side}</div>}
			</div>
			<div cl={styles.main}>{desc}</div>
		</div>
	)
}