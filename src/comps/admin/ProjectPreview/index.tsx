
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { WaitButton } from "src/comps/common/WaitBtn"
import { CopyButton } from "src/comps/common/CopyBtn"

export const ProjectPreview: Component<{project: Doc<Project>}> = ({project}, comp) => {
	return (
		<div cl={styles.wrapper}>
			
			<div cl={styles.info_wrapper}>
				<div cl={styles.info_title}>{project.name}</div>
				<span cl={styles.info_description}>{project.description}</span>
			</div>
			<div cl={styles.actions}>
				<Anchor href={`/project/${project.id}`}>View</Anchor>
				<Anchor href={`/admin/project/${project.id}`}>Edit</Anchor>
				<WaitButton
					onclick={async () => {
						if (!confirm(`Delete "${project.name}" forever?`)) return;

						try {
							await Fire.data.remove(
								Fire.data.doc("projects", project.id)
							);
						}
						catch(error) {
							alert(error);
						}

					}}>Delete</WaitButton>
				<CopyButton copyText={project.id}>Copy ID</CopyButton>
				<WaitButton onclick={async () => {
					const link = prompt("What image?");
					if (!link) return;

					try {
						await Fire.data.update<Project>(
							Fire.data.doc(`projects`, project.id),
							{
								cover: link
							}
						)
						comp.re();
					}
					catch (error) {
						alert(error);
					}
				}}>Set Cover</WaitButton>
			</div>
		</div>
	)
}