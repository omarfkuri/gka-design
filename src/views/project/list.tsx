import { Doc } from "@dunes/fire";
import { Unsubscribe } from "firebase/firestore";
import { ProjectPreview } from "src/comps/home/ProjectPreview";
import { Wrapper } from "src/comps/home/Wrapper";
import styles from "src/style/views/project/list.m.less";

export default class ProjectIndex extends View {
	content({view}: {view: ProjectIndex}, comp: Comp<{}>) {
		return (
			<Wrapper>
				<div cl={styles.list_wrapper}>
					{
						view.#projects
						? (
							view.#projects.length
							? view.#projects.map(project => 
									<ProjectPreview project={project}/>
								)
							: <div>No Projects</div>
						)
						: <div>Loading...</div>
					}
				</div>
			</Wrapper>
		)
	}

	#unsub?: Unsubscribe
	#projects?: Doc<Project>[]

	override async hasShown() {
		if (this.#unsub) {
			return;
		}

		this.#unsub = Fire.data.onSnap<Project>(
			Fire.data.col("projects"), projects => {
				this.#projects = projects;
				this.comp!.re();
			}
		)
	}

	override willDestroy() {
		this.#unsub?.();
	}
}