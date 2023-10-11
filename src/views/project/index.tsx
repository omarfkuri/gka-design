
import type { Doc } from "@dunes/fire";
import type { Comp } from "@dunes/tag";
import styles from "src/style/views/project/index.m.less";
import { SectionPreview } from "src/comps/home/SectionPreview";
import { TopBar } from "src/comps/home/TopBar";

export default class ProjectView extends View {
	
	#project?: Doc<Project>
	#sections?: Doc<Section>[]

	content({view}: {view: ProjectView}, comp: Comp<{}>) {
		
		return (
			view.#project
			? (
				<div id="app">
					<TopBar/>
					<div cl={styles.title}>
						{view.#project.name}
					</div>
					<div cl={styles.list_wrapper}>
						{view.#sections
							? view.#sections.length
								? view.#sections.map(section => 
									<SectionPreview section={section} projID={view.#project!.id!}/>
								)
								: <div>No sections</div>
							: <div>Loading...</div>

						}
					</div>
				</div>
			)
			: (
				<div id="app">
					Loading...
				</div>
			)
		)
	}

	override async hasShown() {
		let re = false;
		if (!this.#project) {
			const [,,id] = location.pathname.split("/");
			const proj = await Fire.store.getDoc<Project>(
				Fire.store.doc("projects", id!)
			);
			if (!proj) {
				return {to: "/admin"}
			}
			this.#project	= proj;
			re = true;
		}

		if (!this.#sections) {

			this.#sections = await Fire.store.getCollection<Section>(
				Fire.store.col(`projects/${this.#project.id}/sections`)
			)
			re = true;
		}

		if (re) {
			this.comp!.re();
		}
	}
}