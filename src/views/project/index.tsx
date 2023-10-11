import type { Doc } from "@dunes/fire";
import type { Comp } from "@dunes/tag";
import styles from "src/style/views/project/index.m.less";
import { SectionPreview } from "src/comps/home/SectionPreview";
import { Wrapper } from "src/comps/home/Wrapper";
import { ShowArray } from "src/comps/common/ShowArray";

export default class ProjectView extends View {
	
	#project?: Doc<Project>
	#sections?: Doc<Section>[]

	content({view}: {view: ProjectView}, comp: Comp<{}>) {
		
		return (
			view.#project
			? (
				<Wrapper>
					<div cl={styles.title}>{view.#project.name}</div>
					<ShowArray
						cl={styles.list_wrapper}
						arr={view.#sections}
						map={sections => sections.map(section => 
							<SectionPreview 
								section={section} 
								projID={view.#project!.id!}/>
						)}
						load={<div>No sections</div>}
						empty={<div>Loading...</div>}
					/>
				</Wrapper>
			)
			: <Wrapper>Loading...</Wrapper>
		)
	}

	override async hasShown() {
		let re = false;
		if (!this.#project) {
			const [,,id] = location.pathname.split("/");
			const proj = await Fire.data.get<Project>(
				Fire.data.doc("projects", id!)
			);
			if (!proj) {
				return {to: "/admin"}
			}
			this.#project	= proj;
			re = true;
		}

		if (!this.#sections) {

			this.#sections = await Fire.data.getCol<Section>(
				Fire.data.col(`projects/${this.#project.id}/sections`)
			)
			re = true;
		}

		if (re) {
			this.comp!.re();
		}
	}
}