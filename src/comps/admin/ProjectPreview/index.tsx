
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { WaitButton } from "src/comps/common/WaitBtn"
import { CopyButton } from "src/comps/common/CopyBtn"
import { Accordion } from "src/comps/common/Accordion"
import { RecommendedEditor } from "../RecommendedEditor"

export const ProjectPreview: Component<{project: Doc<Project>}> = ({project}, comp) => {
	return (
		<div cl={styles.wrapper}>
			
			<div cl={styles.info_wrapper}>
				<div cl={styles.info_title}>{project.name}</div>
				<span cl={styles.info_description}>{project.description}</span>
			</div>
			<Accordion
				openText="Recommended"
				show={btn => (
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
						
						{btn}
					</div>
				)}
			>
				<RecommendedEditor 
					projID={project.id} related={project.related || []}/>
			</Accordion>
		</div>
	)
}