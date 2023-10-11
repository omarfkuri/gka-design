
import { Doc } from "@dunes/fire";
import { Unsubscribe } from "firebase/firestore";
import { ProjectPreview } from "src/comps/home/ProjectPreview";
import { TopBar } from "src/comps/home/TopBar";
import styles from "src/style/views/project/list.m.less";

export default class ProjectIndex extends View {
	content({view}: {view: ProjectIndex}, comp: Comp<{}>) {
		return (
			<div id="app">
				<TopBar/>
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
				</div>
		)
	}

	#unsub?: Unsubscribe
	#projects?: Doc<Project>[]

	override async hasShown() {
		if (this.#unsub) {
			return;
		}

		this.#unsub = Fire.store.onDocs<Project>(
			Fire.store.col("projects"), projects => {
				this.#projects = projects;
				this.comp!.re();
			}
		)
	}

	override willDestroy() {
		this.#unsub?.();
	}
}