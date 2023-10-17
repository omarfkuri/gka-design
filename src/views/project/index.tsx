import type { Doc } from "@dunes/fire";
import styles from "src/style/views/project/index.m.less";
import { SectionPreview } from "src/comps/home/SectionPreview";
import { Wrapper } from "src/comps/home/Wrapper";
import { ShowArray } from "src/comps/common/ShowArray";
import { RecommendedProject } from "src/comps/home/RecommendedProject";

export default class ProjectView extends View {
	
	#project?: Doc<Project>
	#sections?: Doc<Section>[]
	#recommended?: Doc<Project>[]

	content({view}: {view: ProjectView}) {
		
		return (
			view.#project
			? (
				<Wrapper projects>
					<div cl={styles.title_wrapper}>
						<div cl={styles.title_title}>{view.#project.name}</div>
					</div>
					<ShowArray
						cl={styles.list_wrapper}
						arr={view.#sections}
						map={sections => sections.map(section => 
							<SectionPreview 
								section={section} 
								projID={view.#project!.id!}/>
						)}
						load={<div>{ph._("no_related")}</div>}
						empty={<div>{ph._("loading")}</div>}
					/>
					<div cl={styles.recommended_wrapper}>
						<div cl={styles.recommended_title}>{ph._("related")}</div>
						<ShowArray
							cl={styles.recommended_container}
							arr={view.#recommended}
							map={recommended => recommended.map(proj =>
								<RecommendedProject project={proj}/>
							)}
							load={<div>{ph._("no_related")}</div>}
							empty={<div>{ph._("loading")}</div>}
						/>
					</div>
				</Wrapper>
			)
			: <Wrapper>{ph._("loading")}</Wrapper>
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

		if (!this.#recommended) {
			this.#recommended = await Promise.all(this.#project.related.map(
				id => Fire.data.get<Project>(Fire.data.doc(`projects`, id))
			)) as Doc<Project>[]
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