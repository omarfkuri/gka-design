
import { Doc } from "@dunes/fire";
import { type Comp } from "@dunes/tag";
import { Unsubscribe } from "firebase/firestore";
import styles from "src/style/views/admin/index.m.less";
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "src/style/comp/Form.m.less";
import { Wrapper } from "src/comps/admin/Wrapper";
import { WaitButton } from "src/comps/common/WaitBtn";
import { ProjectPreview } from "src/comps/admin/ProjectPreview";

export default class Admin extends View {

	override willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}

	#name = "";
	#description = "";

	content({view}: {view: Admin}, comp: Comp<{}>) {
		
		return (
			<Wrapper side={[
				<Form
					css={formStyles as FormStyles}
					titleText="New Project"
					submitText="Add"
					onsubmit={async (e) => {
						e.preventDefault()
						try {
							await Fire.data.set<Project>(
								Fire.data.doc("projects", view.#name.replace(/[^\w]+/g, "")),
								{
									name: view.#name,
									description: view.#description,
									createdAt: Fire.data.stamp(),
									updatedAt: Fire.data.stamp(),
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
				<WaitButton onclick={async () => {
					if (confirm("Log out")) {
						try {
							await Fire.auth.self.signOut();
							await router.reloadCurrent();
						}
						catch(error) {
							alert(error);
						}
					}
				}}>Logout</WaitButton>
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