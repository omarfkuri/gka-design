
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"

export function ProjectPreview({project}: {project: Doc<Project>}) {
	return (
		<div cl={styles.wrapper}>
			<h5>{project.name}</h5>
			<p>{project.description}</p>
			<Anchor href={`/project/${project.id}`}>View</Anchor>
		</div>
	)
}