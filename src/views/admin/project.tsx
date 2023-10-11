
import type { Doc } from "@dunes/fire";
import styles from "src/style/views/admin/project.m.less";
import { Wrapper } from "src/comps/admin/Wrapper";
import { Uploader } from "src/comps/admin/Uploader";
import { NameDesc } from "src/comps/admin/NameDesc";
import { AdminSectionPreview } from "src/comps/admin/SectionPreview";
import { WaitButton } from "src/comps/common/WaitBtn";
import { alertError } from "src/fn/alertError";

export default class ProjectView extends View {

	override willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}
	
	#project?: Doc<Project>
	#sections?: Doc<Section>[]

	content({view}: {view: ProjectView}) {
		
		return (
			view.#project ?
			<Wrapper side={[
				<NameDesc 
					name={view.#project!.name}
					description={view.#project!.description}
					ref={Fire.data.doc<Project>("projects", view.#project.id)}
				/>,
				<Anchor href={`/project/${view.#project.id}`}>View</Anchor>,
				<WaitButton
					onclick={alertError(async () => {
						await Fire.data.add<Section>(
							Fire.data.col(`projects/${view.#project!.id}/sections`),
							{
								name: "My Section",
								ordinal: 0,
								images: [],
								description: "Lorem Ipsum Dolor",
								createdAt: Fire.data.stamp(),
								updatedAt: Fire.data.stamp(),
							}
						);
						view.#sections = undefined;
						await router.reloadCurrent();
					})}
				>Add Section</WaitButton>,
				<Uploader/>
			]}>
				<div cl={styles.list_wrapper}>
					{view.#sections
						? view.#sections.length
							? view.#sections.map(section => 
								<AdminSectionPreview section={section} projID={view.#project!.id!}/>
							)
							: <div>No sections</div>
						: <div>Loading...</div>

					}
				</div>
			</Wrapper>
			: <Wrapper>Loading...</Wrapper>
		)
	}

	override async hasShown() {
		let re = false;
		if (!this.#project) {
			const [,,,id] = location.pathname.split("/");
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