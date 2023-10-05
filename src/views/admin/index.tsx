
import { Doc } from "@dunes/fire";
import { type Comp } from "@dunes/tag";
import { Unsubscribe } from "firebase/firestore";
import styles from "src/style/views/admin/index.m.less";
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "src/style/comp/Form.m.less";
import { ProjectPreview } from "src/comps/ProjectPreview";
import { AdminView } from "src/comps/AdminView";

export default class Admin extends View {

	willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}

	#name = "";
	#description = "";

	content({view}: {view: Admin}, comp: Comp<{}>) {
		
		return (
			<AdminView side={[
				<Form
					css={formStyles as FormStyles}
					titleText="New Project"
					submitText="Add"
					onsubmit={async (e) => {
						e.preventDefault()
						try {
							await Fire.store.setDoc<Project>(
								Fire.store.doc("projects", view.#name.replace(/[^\w]+/g, "")),
								{
									name: view.#name,
									description: view.#description,
									createdAt: Fire.store.stamp(),
									updatedAt: Fire.store.stamp(),
								}
							);
							view.#name = "";
							view.#description = "";
							comp.re();
						}
						catch(error) {
							alert(error);
						}
					}}
					inputs={[
						{
							title: "Name",
							input: (
								<input
									required
									value={view.#name}
									oninput={e => view.#name = e.target.value}
									type="text"
								/>
							)
						},
						{
							title: "Description",
							input: (
								<textarea
									required
									oninput={e => view.#description = e.target.value}
								>{view.#description}</textarea>
							)
						}
					]}
				/>,
				<button onclick={async () => {
					if (confirm("Log out")) {
						try {
							await Fire.auth.self.signOut();
							await router.reloadCurrent();
						}
						catch(error) {
							alert(error);
						}
					}
				}}>Logout</button>
			]}>
				<div cl={styles.list_wrapper}>{
					view.#projects
					? (
						view.#projects.length
						? view.#projects.map(project => 
								<ProjectPreview project={project}/>
							)
						: <div>No Projects</div>
					)
					: <div>Loading...</div>
				}</div>
			</AdminView>
		)
	}

	#unsub?: Unsubscribe
	#projects?: Doc<Project>[]

	async hasShown() {
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

	willDestroy() {
		this.#unsub?.();
	}
}