
import type { Doc } from "@dunes/fire";
import type { Comp } from "@dunes/tag";
import styles from "src/style/views/admin/project.m.less";
import { SectionPreview } from "src/comps/SectionPreview";
import { AdminView } from "src/comps/AdminView";
import { Uploader } from "src/comps/Uploader";

export default class ProjectView extends View {

	override willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}
	
	#project?: Doc<Project>
	#sections?: Doc<Section>[]
	#name?: string
	#desc?: string

	content({view}: {view: ProjectView}, comp: Comp<{}>) {
		
		return view.#project
			? (
				<AdminView side={[
					<div cl={styles.name_container}>
						<h5 
							onkeydown={e => {
								view.#name = e.target.innerText;
							}}
							contenteditable>{view.#project.name}
						</h5>
						<p
							onkeydown={e => {
								view.#desc = e.target.innerText;
							}}
							contenteditable>{view.#project.description}
						</p>
						<button
							onclick={async () => {
								try {
									await Fire.store.updateDoc<Project>(
										Fire.store.doc("projects", view.#project!.id),
										{
											name: view.#name,
											description: view.#desc
										}
									)
									view.#project = undefined;
									await router.reloadCurrent();
								}
								catch(err) {
									alert(err)
								}
							}}>Update
						</button>
					</div>,
					<button
						onclick={async (e) => {
							e.target.disabled = true
							try {
								await Fire.store.addDoc<Section>(
									Fire.store.col(`projects/${view.#project!.id}/sections`),
									{
										name: "My Section",
										ordinal: 0,
										images: [],
										description: "Lorem Ipsum Dolor",
										createdAt: Fire.store.stamp(),
										updatedAt: Fire.store.stamp(),
									}
								);
								view.#sections = undefined;
								await router.reloadCurrent();
							}
							catch(error) {
								alert(error);
							}
							e.target.disabled = false
						}}
					>Add Section</button>,
					<Uploader/>
				]}>
					<div cl={styles.list_wrapper}>
						{view.#sections
							? view.#sections.length
							? view.#sections.map(section => 
								<SectionPreview section={section} projID={view.#project?.id!}/>
							)
							: <div>No sections</div>
							: <div>Loading...</div>

						}
					</div>
				</AdminView>
			)
			: <AdminView>Loading...</AdminView>
	}

	override async hasShown() {
		let re = false;
		if (!this.#project) {
			const [,,,id] = location.pathname.split("/");
			const proj = await Fire.store.getDoc<Project>(
				Fire.store.doc("projects", id!)
			);
			if (!proj) {
				return {to: "/admin"}
			}
			this.#project	= proj;
			this.#name = proj.name
			this.#desc = proj.description
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